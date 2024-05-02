<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', Auth::id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function loadOlder(Message $message)
    {
        // Load older messages that are older than the given message, sort them by the latest
        if($message->group_id) {
            $messages = Message::where('group_id', $message->group_id)
                ->where('created_at', '<', $message->created_at)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);

        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        /** @var UploadedFile[] $files */
        $files = $data['attachments'] ?? [];

        $message = Message::create($data);
        $attachments = [];
        if($files) {
//            $message->attachments()->createMany($files);
            $message->attachments = $attachments;

            foreach($files as $file) {
                $folderName = "/attachments/" . Str::random(32);
                $path = Storage::disk('public')->put($folderName, $file);

                $message->attachments()->create([
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
//                    'mime' => $file->getMimeType(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ]);
            }
        }

        if($receiverId) {
//            $receiver = User::find($receiverId);
//            $message->receiver()->associate($receiver);
            Conversation::updatedConversationWithMessage(Auth::id(), $receiverId, $message);

        } else if($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);
//        SocketMessage::dispatch(new MessageResource($message));

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        // Check if the authenticated user is the sender of the message
        if($message->sender_id !== Auth::id()) {
//            abort(403, 'Unauthorized');
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message->delete();

        return response()->noContent();
    }
}
