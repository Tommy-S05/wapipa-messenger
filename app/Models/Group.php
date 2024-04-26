<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

/**
 * @mixin Builder
 */

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_user');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public static function getGroupsForUser(User $user)
    {
        $userId = $user->id;
        $query = self::select(['groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->join('group_user', 'groups.id', '=', 'group_user.group_id')
            ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
            ->where('group_user.user_id', $userId)
            //            ->join('users', 'users.id', '=', 'groups.owner_id')
            ->orderBy('last_message_date', 'desc')
            ->orderBy('groups.name');

        return $query->get();
    }

    public function toConversationArray()
    {
        $formattedLastMessageDate = null;
        if ($this->last_message_date) {
            $formattedLastMessageDate = Carbon::parse($this->last_message_date)->format('d-m-Y H:i:s');
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id' => $this->owner_id,
            'users' => $this->users,
            'users_ids' => $this->users->pluck('id'),
            'created_at' => $this->created_at->format('d-m-Y H:i:s'),
            'updated_at' => $this->updated_at->format('d-m-Y H:i:s'),
            'last_message' => $this->last_message,
            'last_message_date' => $formattedLastMessageDate
        ];
    }
}
