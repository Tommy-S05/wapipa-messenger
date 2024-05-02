import {PaperClipIcon, PhotoIcon, FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid';
import {useState} from "react";
import NewMessageInput from "@/Components/App/NewMessageInput.jsx";

export default function MessageInput({conversation = null}) {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [inputErrorMessage, setInputErrorMessage] = useState('');
    const [messageSending, setMessageSending] = useState(false);

    const onSendClick = () => {
        if (newMessage.trim() === '') {
            setInputErrorMessage('Please enter a message or upload a file.');

            setTimeout(() => {
                setInputErrorMessage('');
            }, 3000)
        }

        const formData = new FormData();
        formData.append('message', newMessage);
        if (conversation.is_user) {

            formData.append('receiver_id', conversation.id);
        } else if (conversation.is_group) {
            formData.append('group_id', conversation.id);
        }

        setMessageSending(true);
        axios.post(route('message.store'), formData, {
            onUploadProgress: (progressEvent) => {
                // console.log(progressEvent.loaded, progressEvent.total);
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(progress);
            }
        }).then((response) => {
            setNewMessage('');
            setMessageSending(false);
        }).catch((error) => {
            setMessageSending(false);
        });
    }

    return (
        <div className={'flex flex-wrap items-start border-t border-slate-700 py-3'}>
            <div className={'order-2 flex-1 xs:flex-none xs:order-1 p-2'}>

                {/*File uploads*/}
                <button className={'p-1 text-gray-400 hover:text-gray-300 relative cursor-pointer'}>
                    <label htmlFor={'files-upload'} className={'cursor-pointer'}>
                        <PaperClipIcon className={'w-6 h-6'}/>
                    </label>
                    <input
                        id={'files-upload'}
                        type={'file'}
                        multiple={true}
                        className={'hidden'}
                    />
                </button>

                {/*Photo uploads*/}
                <button className={'p-1 text-gray-400 hover:text-gray-300 relative cursor-pointer'}>
                    <label htmlFor={'images-upload'} className={'cursor-pointer'}>
                        <PhotoIcon className={'w-6 h-6'}/>
                    </label>
                    <input
                        id={'images-upload'}
                        type={'file'}
                        multiple={true}
                        className={'hidden'}
                    />
                </button>

                {/*<button className={'p-1 text-gray-400 hover:text-gray-300 relative cursor-pointer'}>*/}
                {/*    <PhotoIcon className={'w-6 h-6'}/>*/}
                {/*    <input*/}
                {/*        type={'file'}*/}
                {/*        multiple={true}*/}
                {/*        accept={'image/*'}*/}
                {/*        className={'absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 invisible cursor-pointer'}*/}
                {/*    />*/}
                {/*</button>*/}
            </div>

            <div className={'order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative'}>
                <div className={'flex'}>
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(e) => setNewMessage(e.target.value)}
                        // onChange={(e) => {
                        //     setNewMessage(e.target.value);
                        //     setIsTyping(e.target.value.length > 0);
                        // }}
                    />
                    <button
                        onClick={onSendClick}
                        className={'btn btn-info rounded-l-none'}
                    >
                        {messageSending && (
                            <span className={'loading loading-spinner loading-xs'}/>
                        )}
                        <PaperAirplaneIcon className={'w-6 h-6'}/>
                        <span className={'hidden sm:inline'}>
                            Send
                        </span>
                    </button>
                </div>

                {inputErrorMessage && (
                    <p className={'text-xs text-red-400'}>
                        {inputErrorMessage}
                    </p>
                )}
            </div>

            <div className={'order-3 xs:order-3 p-2 flex'}>
                <button className={'p-1 text-gray-400 hover:text-gray-300'}>
                    <FaceSmileIcon className={'w-6 h-6'}/>
                </button>

                <button className={'p-1 text-gray-400 hover:text-gray-300'}>
                    <HandThumbUpIcon className={'w-6 h-6'}/>
                </button>
            </div>
        </div>
    );
}
