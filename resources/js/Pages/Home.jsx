import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import {useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import {useEventBus} from "@/EventBus.jsx";

function Home({messages = null, selectedConversation = null}) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const {on} = useEventBus();

    const messageCreated = (message) => {
        if (selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        } else if (selectedConversation && selectedConversation.is_user && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on('message.created', messageCreated)

        return () => {
            offCreated();
        }

    }, [selectedConversation]);

    useEffect(() => {
        // if (message) {
        //     setLocalMessages([...localMessages, message]);
        // }
        setLocalMessages(messages ? messages?.data.reverse() : []);
    }, [messages]);

    return (
        <ChatLayout>
            <Head title="Dashboard"/>

            {!messages && (
                <div className={'flex flex-col gap-8 justify-center items-center text-center h-full opacity-35'}>
                    <div className={'text-2xl md:text-4xl p-16 text-slate-200'}>
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className={'w-32 h-32 inline-block'}/>
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />

                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {/*Messages*/}
                        {localMessages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <p className={'text-lg text-slate-200'}>
                                    No messages found
                                </p>
                            </div>
                        ) : (
                            <div className={'flex flex-1 flex-col'}>
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput
                        conversation={selectedConversation}
                    />
                </>
            )}
        </ChatLayout>
    );
}

Home.layout = page => (
    <AuthenticatedLayout
        // header={<h2
        //     className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{trans(page.props.translations_messages.dashboard)}</h2>}
        children={page}
    />
);

export default Home;
