import {usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {trans} from "@/helpers.js";
import {useEffect, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";

const ChatLayout = ({children}) => {
    const page = usePage();
    const {translations_messages, translations_actions} = page.props;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineUsers[userId];

    // console.log(conversations);

    const onSearch = (e) => {
        let search = e.target.value;
        const filteredConversations = conversations.filter((conversation) => {
            if (conversation.is_group) {
                return conversation.name.toLowerCase().includes(search);
            } else {
                return (
                    conversation.name.toLowerCase().includes(search) ||
                    conversation.email?.toLowerCase().includes(search)
                );
            }
        });

        setLocalConversations(filteredConversations);
    }

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                    if (a.blocked_at && b.blocked_at) {
                        return a.blocked_at > b.blocked_at ? 1 : -1;
                    } else if (a.blocked_at) {
                        return 1;
                    } else if (b.blocked_at) {
                        return -1;
                    }

                    if (a.last_message_date && b.last_message_date) {
                        return b.last_message_date.localeCompare(a.last_message_date);
                        // return a.last_message_date.created_at > b.last_message_date.created_at ? -1 : 1;
                    } else if (a.last_message_date) {
                        return -1;
                    } else if (b.last_message_date) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            )
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user]));

                setOnlineUsers((prevOnlineUsers) => {
                    return {...prevOnlineUsers, ...onlineUsersObj};
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers};
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers};
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.error("error", error);
            });

        return () => {
            Echo.leave('online');
        }
    }, []);
    return (
        <>
            <main className={'flex flex-1 w-full overflow-hidden'}>
                {/*SideBar Chat*/}
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''}`}
                >
                    {/*Header*/}
                    <div className={'flex items-center justify-between py-2 px-3 text-xl font-medium'}>
                        <h2 className={'text-gray-200'}>
                            {trans(translations_messages.my_conversations)}
                        </h2>
                        <div
                            className={'tooltip tooltip-left'}
                            data-tip={trans(translations_actions.create_new_user)}
                        >
                            <button
                                className={'text-gray-400 hover:text-gray-200'}
                            >
                                <PencilSquareIcon className={'w-4 h-4 inline-block ml-2'}/>
                            </button>
                        </div>
                    </div>

                    {/*Search*/}
                    <div className={'p-3'}>
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder={trans(translations_actions.search)}
                            className={'w-full'}
                        />
                    </div>

                    {/*Conversations*/}
                    <div className={'flex-1 overflow-auto'}>
                        {
                            sortedConversations && sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.is_group
                                        ? `group_${conversation.id}`
                                        : `user_${conversation.id}`
                                    }
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                >

                                </ConversationItem>
                            ))
                        }
                    </div>
                </div>

                <div className={'flex flex-1 flex-col overflow-hidden'}>
                    {children}
                </div>
            </main>
        </>
    )
}

export default ChatLayout;
