<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;

/**
 * @mixin Builder
 */

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'avatar',
        'password',
        'email_verified_at',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups(): BelongsToMany
    {
//        return $this->belongsToMany(Group::class, 'group_user', 'user_id', 'group_id');
        return $this->belongsToMany(Group::class, 'group_user');
    }

    public static function getUsersExceptAuthUser(User $user)
    {
        $userId = $user->id;
        $query = User::select(['users.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->where('users.id', '!=', $userId)
            ->when(!$user->is_admin, function($query) {
                $query->whereNull('users.blocked_at');
            })
            ->leftJoin('conversations', function($join) use ($userId) {
                $join->on('users.id', '=', 'conversations.user_id1')
                    ->where('conversations.user_id2', '=', $userId)
                    ->orWhere(function($query) use ($userId) {
                        $query->on('users.id', '=', 'conversations.user_id2')
                            ->where('conversations.user_id1', '=', $userId);
                    });
            })
            ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
            ->orderByRaw('IFNULL(users.blocked_at, 1)')
//            ->orderBy('last_message_date', 'desc')
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('users.name');

        return $query->get();


//        $query = User::select('users.*')
//            ->leftJoin('group_user', 'users.id', '=', 'group_user.user_id')
//            ->where('users.id', '!=', $userId)
//            ->where('group_user.user_id', '!=', $userId)
//            ->groupBy('users.id');
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
            'is_group' => false,
            'is_user' => true,
            'is_admin' => (bool) $this->is_admin,
//            'created_at' => $this->created_at->format('d-m-Y H:i:s'),
            'created_at' => $this->created_at,
//            'updated_at' => $this->updated_at->format('d-m-Y H:i:s'),
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
//            'last_online' => $this->last_online,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date
        ];
    }
}
