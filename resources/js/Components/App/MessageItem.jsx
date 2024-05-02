import {usePage} from "@inertiajs/react";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import ReactMarkdown from "react-markdown";
import {formatMessageDateLong} from "@/helpers.js";

export default function MessageItem({message}) {
    const currentUser = usePage().props.auth.user;
    return (
        <div
            className={'chat' + (
                message.sender_id === currentUser.id ? ' chat-end' : ' chat-start'
            )}
        >
            <UserAvatar user={message.sender}/>

            <div className={'chat-header'}>
                {message.sender_id !== currentUser.id
                    ? message.sender.name + ' '
                    : 'Me '
                }

                <time className="text-xs opacity-50">
                    {formatMessageDateLong(message.created_at)}
                    {/*{message.created_at}*/}
                </time>
            </div>

            <div
                className={'chat-bubble relative ' + (
                    message.sender_id === currentUser.id
                        ? 'chat-bubble-info'
                        : 'chat-bubble-accent'
                )}
            >
                <div className={'chat-message'}>
                    <div className={'chat-message-content'}>
                        <ReactMarkdown>
                            {message.message}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
