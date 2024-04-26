import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {trans} from "@/helpers.js";
import ChatLayout from "@/Layouts/ChatLayout.jsx";

function Home({ auth }) {

    return (
        <ChatLayout>
            <Head title="Dashboard" />

            {/*<div className="py-12">*/}
            {/*    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">*/}
            {/*        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">*/}
            {/*            <div className="p-6 text-gray-900 dark:text-gray-100">{trans(welcome)}</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
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
