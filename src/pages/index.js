import Head from 'next/head'
import { useState } from 'react';
import {IconMessage, IconMicrophone} from "@/components/Icons";



function MessagesList({messages}) {
    return (
        <div>
            {messages.reverse().map((message, index) => <Message key={index} message={message}></Message>)}
        </div>
    )
}

function Message({message}) {
    return (
        <div className={`text-gray-100`}>
            <article className='flex gap-4 p-6 max-w-3xl'>
                <div className='min-h-[20px] flex flex-1 flex-col items-start gap-4 whitespace-pre-wrap'>
                    <div className='prose-invert w-full break-words'>
                        <p>{message}</p>
                    </div>
                </div>
            </article>
        </div>
    )
}


async function getChatMessage(message) {
    const requestConfig = {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message})
    }

    try {
        const response = await fetch('/api', requestConfig);

        const data = await response.json();
        const newMessage = data.text

        if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        return newMessage
    } catch(error) {
        console.error(error);
        alert(error.message);
    }
}

export default function Home() {
    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])

    function onInputTextarea(event) {
        const newText = event.target.value
        setText(newText)
    }

    async function onSendButtonClick(event) {
        event.preventDefault()

        if (text.length > 0) {
            updateMessages(text)
            const message = await getChatMessage(text)
            updateMessages(message)
        }

        setText('')
    }

    async function onSpeechButtonClick() {
        const spoken = (await import('../../node_modules/spoken/build/spoken')).default

        const transcript  = await spoken.listen

        updateMessages(transcript)
        const message = await getChatMessage(transcript)
        updateMessages(message)
        spoken.say(message)
    }

    function updateMessages(newMessage) {
        setMessages((previousMessages) => {
            return [newMessage, ...previousMessages]
        })
    }


    return (
        <>
            <Head>
                <title>POC OpenAI Davinci Voice Chat</title>
                <meta name="description" content="GPT Voice Assistant" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={'w-full h-screen min-w-[300px] grid grid-cols-1 grid-rows-[100px_1fr_150px] bg-slate-700' }>
                <section className={'p-4'}>
                    <h1 className={'text-2xl text-white'}>Davinci Voice Chat</h1>
                </section>
                <section className={'border-2 border-y-gray-900/50 border-x-transparent overflow-auto'}>
                    <MessagesList messages={messages}></MessagesList>
                </section>
                <section className={'sticky flex flex-col justify-center items-center'}>
                    <div className={'relative flex flex-col flex-grow w-full px-4 py-3 text-white'}>
                        <textarea className={'w-full h-[24px] resize-none bg-transparent m-0 border-0 outline-none'} name="" id="" value={text} onInput={onInputTextarea}></textarea>
                        <button className={'absolute p-1 rounded-md bottom-2.5 right-2.6'} onClick={onSendButtonClick}><IconMessage></IconMessage></button>
                        <button className={'absolute p-1 rounded-md bottom-2.5 right-2.5'} onClick={onSpeechButtonClick}><IconMicrophone></IconMicrophone></button>
                    </div>
                </section>
            </main>


        </>
    )
}
