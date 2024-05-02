<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

//Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//    return (int) $user->id === (int) $id;
//});

Broadcast::channel('online', function(User $user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('messages.user.{userId1}', function (User $user, $userId1) {
    $num = $userId1;
    return (int) $userId1 === (int) $user->id;
});

Broadcast::channel('messages.user.{userId1}-{userId2}', function(User $user, int $userId1, int $userId2) {
    return (int) $user->id === (int) $userId1 || (int) $user->id === (int) $userId2 ? new UserResource($user) : false;
//    return true;
});

Broadcast::channel('messages.group.{groupId}', function(User $user, $groupId) {
    return $user->groups->contains('id', (int) $groupId) ? new UserResource($user) : false;
//    return true;
});
