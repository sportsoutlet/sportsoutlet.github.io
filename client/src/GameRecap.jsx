import { useEffect, useRef, useState } from 'react';
import './game-summary-page.css';

export default function GameRecap({ text, youtubeId, name, delay = 50 }) {
    const [htmlBefore, setHtmlBefore] = useState('');
    const [htmlAfter, setHtmlAfter] = useState('');
    const [index, setIndex] = useState(0);
    const [allTokens, setAllTokens] = useState([]);
    const [videoReached, setVideoReached] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const [videoErrorCode, setVideoErrorCode] = useState(null);

    const playerRef = useRef(null);
    const iframeContainerRef = useRef(null);

    // HTML-aware tokenizer
    const tokenizeHTMLString = (html) => {
        return html
            .replace('%user%', name)
            .replace('%gamehighlight%', '%VIDEO%')
            .split(/(%VIDEO%|<[^>]+>|\s+)/)
            .filter(token => token !== null && token !== undefined);
    };

    // Prepare tokenized content
    useEffect(() => {
        const tokens = tokenizeHTMLString(text);
        setAllTokens(tokens);
        setHtmlBefore('');
        setHtmlAfter('');
        setIndex(0);
        setVideoReached(false);
        setVideoFailed(false);
        setVideoErrorCode(null);
    }, [text, youtubeId, name]);

    // Reveal text token by token
    useEffect(() => {
        if (index >= allTokens.length) return;

        const timeout = setTimeout(() => {
            const token = allTokens[index];

            if (token === '%VIDEO%') {
                setVideoReached(true);
                setIndex((prev) => prev + 1); // ✅ fix to continue after %VIDEO%
                return;
            }

            if (!videoReached) {
                setHtmlBefore((prev) => prev + token);
            } else {
                setHtmlAfter((prev) => prev + token);
            }

            setIndex((prev) => prev + 1);
        }, delay);

        return () => clearTimeout(timeout);
    }, [index, allTokens, delay, videoReached]);

    // Inject YouTube Player when videoReached
    useEffect(() => {
        if (!videoReached || !youtubeId) return;

        const loadYouTubeAPI = () => {
            return new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    resolve();
                } else {
                    const tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/iframe_api';
                    const firstScript = document.getElementsByTagName('script')[0];
                    firstScript.parentNode.insertBefore(tag, firstScript);

                    window.onYouTubeIframeAPIReady = () => {
                        resolve();
                    };
                }
            });
        };

        loadYouTubeAPI().then(() => {
            if (!iframeContainerRef.current) return;

            playerRef.current = new window.YT.Player(iframeContainerRef.current, {
                videoId: youtubeId,
                width: '100%',// 👈 Use container height
                playerVars: {
                    rel: 0,
                },
                events: {
                    onReady: () => { },
                    onError: (event) => {
                        const code = event.data;
                        setVideoErrorCode(code);
                        setVideoFailed(true);
                    },
                },
            });
        });

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoReached, youtubeId]);

    return (
        <div className="max-w-full space-y-4 text-left response-wrapper">
            {htmlBefore && (
                <p
                    className="max-w-full"
                    dangerouslySetInnerHTML={{ __html: htmlBefore }}
                />
            )}

            {videoReached && youtubeId && (
                <div className="my-4 text-center">
                    {!videoFailed ? (
                        <div className="relative w-full pb-[56.25%] mx-auto my-7">
                            <div className='video-container' ref={iframeContainerRef} />
                        </div>
                    ) : (
                        videoErrorCode === 101 || videoErrorCode === 150 ? (
                            <a
                                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 my-3 bg-red-600 !text-neutral-100 text-base font-medium rounded-full shadow hover:bg-red-700 hover:shadow-md transition duration-200"
                            >
                                ▶ Watch on YouTube
                            </a>
                        ) : (
                            <a
                                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 my-3 bg-neutral-600 !text-neutral-100 text-base font-medium rounded-full shadow hover:bg-neutral-700 hover:shadow-md transition duration-200"
                            >
                                ▶ Unavailable in your country
                            </a>
                        )
                    )}
                </div>
            )}

            {htmlAfter && (
                <p
                    className="max-w-full"
                    dangerouslySetInnerHTML={{ __html: htmlAfter }}
                />
            )}
        </div>
    );
}
