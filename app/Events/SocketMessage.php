<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message)
    {
        //
    }

    public function broadcastWith(): array
    {
        return [
            'message' => new MessageResource($this->message)
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $message = $this->message;
        $channels = [];

        if($message->group_id) {
            $channels[] = new PrivateChannel('messages.group.' . $message->group_id);
        } else {
            //            new PrivateChannel('messages.user.' . $message->sender_id . '-' . $message->receiver_id),
            //            new PrivateChannel('messages.user.' . $message->receiver_id . '-' . $message->sender_id),
            $channels[] = new PrivateChannel('messages.user.' . collect([$message->sender_id, $message->receiver_id])->sort()->implode('-'));
        }

        return $channels;
    }
}
