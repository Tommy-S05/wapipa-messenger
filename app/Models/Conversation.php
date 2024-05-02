<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/**
 * @mixin Builder
 */

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id'
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getConversationsForSideBar(User $user)
    {
        $users = User::getUsersExceptAuthUser($user);
        $groups = Group::getGroupsForUser($user);

        return $users->map(function(User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function(Group $group) {
            return $group->toConversationArray();
        }));
    }

    public static function updatedConversationWithMessage($userId1, $userId2, $message)
    {
        //        $conversation = Conversation::where('user_id1', $userId1)
        //            ->where('user_id2', $userId2)
        //            ->orWhere('user_id1', $userId2)
        //            ->where('user_id2', $userId1)
        //            ->first();

        $conversation = Conversation::where(function($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
                ->where('user_id2', $userId2);
        })->orWhere(function($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId2)
                ->where('user_id2', $userId1);
        });

        if($conversation) {
            $conversation->update([
                'last_message_id' => $message->id
            ]);
        } else {
            $conversation = Conversation::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id
            ]);
        }

        return $conversation;
    }
}
