import {useEffect, useRef} from "react";

export default function NewMessageInput({value, onChange, onSend}){
    const input = useRef();

    const onInputKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    const onChangeHandler = (e) => {
        setTimeout(() => {
            adjustHeight();
        }, 10)

        onChange(e);
    }

    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = 'auto';
            // input.current.style.height = (input.current.scrollHeight) + 'px';
            input.current.style.height = (input.current.scrollHeight) + 1 + 'px';
        }, 100)
    }

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows={1}
            placeholder={'Type a message...'}
            onChange={onChangeHandler}
            onKeyDown={onInputKeyDown}
            className={'input input-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40'}
            // className={'w-full p-2 resize-none rounded-l bg-slate-700 text-slate-200'}
            // style={{
            //     minHeight: '3rem',
            //     maxHeight: '10rem',
            //     overflow: 'hidden',
            // }}
        />
    )
}
