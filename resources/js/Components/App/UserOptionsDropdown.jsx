import {Menu, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon, LockOpenIcon, LockClosedIcon, UserIcon, ShieldCheckIcon} from "@heroicons/react/24/solid";
import {Fragment} from "react";
import {usePage} from "@inertiajs/react";
import {trans} from "@/helpers.js";

export default function UserOptionsDropdown({conversation}) {
    const {translations_actions} = usePage().props;
    const onBlockUser = () => {
        console.log('block user');
        if (!conversation.is_user) {
            return;
        }

        axios.post(route('user.blockUnblock', conversation.id))
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const changeUserRole = () => {
        console.log('change user role');
        if (!conversation.is_user) {
            return;
        }

        axios.post(route('user.changeRole', conversation.id))
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className={'flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40'}>
                        <EllipsisVerticalIcon className={'w-4 h-4'}/>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className={'absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50'}>
                        <div className={'p-1'}>
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={onBlockUser}
                                        className={`${
                                            active
                                                ? 'bg-black/30 text-white'
                                                : 'text-gray-100'
                                        } group flex w-full items-center rounded-md p-2 text-sm`}
                                    >
                                        {conversation.blocked_at && (
                                            <>
                                                <LockOpenIcon className={'w-4 h-4 mr-2'}/>
                                                {trans(translations_actions.unblock_user)}
                                            </>
                                        )}
                                        {!conversation.blocked_at && (
                                            <>
                                                <LockClosedIcon className={'w-4 h-4 mr-2'}/>
                                                {trans(translations_actions.block_user)}
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>

                        <div className={'p-1'}>
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={changeUserRole}
                                        className={`${
                                            active
                                                ? 'bg-black/30 text-white'
                                                : 'text-gray-100'
                                        } group flex w-full items-center rounded-md p-2 text-sm`}
                                    >
                                        {conversation.is_admin && (
                                            <>
                                                <UserIcon className={'w-4 h-4 mr-2'}/>
                                                {trans(translations_actions.remove_admin)}
                                            </>
                                        )}
                                        {!conversation.is_admin && (
                                            <>
                                                <ShieldCheckIcon className={'w-4 h-4 mr-2'}/>
                                                {trans(translations_actions.make_admin)}
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}
