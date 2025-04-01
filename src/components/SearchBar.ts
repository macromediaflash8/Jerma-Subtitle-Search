import m, { type Vnode } from 'mithril';
import { changeSetting } from './Settings';
import '../styles/SearchBar.scss';

export const SearchBar = () => {
    const illegalInputsRegex = new RegExp(/[^A-Za-z0-9* ]/, 'g');
    const illegalSubmitRegex = new RegExp(/^[* ]+|[* ]+$/, 'g');
    const wildcardCollapseRegex = new RegExp(/[*-]*\*[*-]*/g, 'g');
    let previousQuery: string;
    let searchQuery: string;

    function setRoute(query: string): string {
        if (query === '') {
            document.title = 'Jerma Search';
            m.route.set('/');
        } else {
            query = query.trim();

            if (query !== previousQuery) {
                const processedQuery = query.replace(illegalSubmitRegex, '').replace(/\s+/g, '-').replace(wildcardCollapseRegex, '*');
                document.title = `Jerma Search | ${query}`;
                m.route.set('/:query', { query: processedQuery });
                previousQuery = query;
                return processedQuery.replace(/-/g, ' ');
            }
        }

        return query;
    }

    return {
        oninit: (vnode: Vnode<{ query: string }>) => {
            searchQuery = vnode.attrs.query;
            searchQuery = setRoute(searchQuery);
        },
        view: () => {
            return m('form#search-bar', {
                onsubmit: function (e: Event) {
                    // @ts-ignore
                    e.redraw = false;
                    e.preventDefault();

                    searchQuery = setRoute(searchQuery);
                }
            },
            [
                m('input', {
                    autofocus: true,
                    name: 'searchQuery',
                    oninput: (e: Event) => {
                        // @ts-ignore
                        e.redraw = false;

                        const inputValue = (e.target as HTMLInputElement).value.replace(illegalInputsRegex, '');
                        (e.target as HTMLInputElement).value = inputValue;
                        searchQuery = inputValue;
                    },
                    placeholder: 'Enter search query',
                    spellcheck: false,
                    title: 'Enter search query (Alt+L)',
                    type: 'text',
                    value: searchQuery
                }),
                m('button#match-whole-words-toggle', {
                    class: localStorage.getItem('use-word-boundaries') === 'true' ? 'active' : '',
                    onclick: () => {
                        changeSetting('use-word-boundaries', (!(localStorage.getItem('use-word-boundaries') === 'true')).toString());
                    },
                    title: `Match Whole Words: ${localStorage.getItem('use-word-boundaries') === 'true' ? 'On' : 'Off'} (Alt+W)`,
                    type: 'button'
                },
                [
                    m('svg.icon#match-whole-words-icon', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', role: 'img', 'aria-label': 'whole word matching icon' }, [
                        m('path', { d: 'M11.5 15C11.6326 15 11.7598 14.9473 11.8536 14.8536C11.9473 14.7598 12 14.6326 12 14.5V14.109C12.2551 14.3859 12.5641 14.6077 12.908 14.7609C13.252 14.9141 13.6235 14.9955 14 15C14.86 14.9287 15.6572 14.5213 16.2188 13.8661C16.7804 13.2109 17.0611 12.3608 17 11.5C17.0611 10.6392 16.7804 9.78905 16.2188 9.13386C15.6572 8.47866 14.86 8.07126 14 8C13.6235 8.00453 13.252 8.08589 12.908 8.2391C12.5641 8.39231 12.2551 8.61414 12 8.891V4C12 3.86739 11.9473 3.74021 11.8536 3.64645C11.7598 3.55268 11.6326 3.5 11.5 3.5C11.3674 3.5 11.2402 3.55268 11.1464 3.64645C11.0527 3.74021 11 3.86739 11 4V14.5C11 14.6326 11.0527 14.7598 11.1464 14.8536C11.2402 14.9473 11.3674 15 11.5 15ZM14 9C14.5939 9.07282 15.1357 9.3752 15.5095 9.84242C15.8832 10.3096 16.0593 10.9046 16 11.5C16.0593 12.0954 15.8832 12.6904 15.5095 13.1576C15.1357 13.6248 14.5939 13.9272 14 14C13.4061 13.9272 12.8643 13.6248 12.4905 13.1576C12.1168 12.6904 11.9407 12.0954 12 11.5C11.9407 10.9046 12.1168 10.3096 12.4905 9.84242C12.8643 9.3752 13.4061 9.07282 14 9V9ZM4.871 14.884C5.41876 14.9954 5.98459 14.9817 6.52634 14.8441C7.0681 14.7064 7.57182 14.4483 8 14.089V14.5C8 14.6326 8.05268 14.7598 8.14645 14.8536C8.24021 14.9473 8.36739 15 8.5 15C8.63261 15 8.75979 14.9473 8.85355 14.8536C8.94732 14.7598 9 14.6326 9 14.5V10.462C9.05051 9.97915 8.95614 9.49219 8.72889 9.06316C8.50165 8.63414 8.15183 8.28249 7.724 8.053C7.14128 7.77817 6.49931 7.65273 5.856 7.688C5.31 7.70105 4.7724 7.82524 4.276 8.053C4.15745 8.11241 4.06736 8.21648 4.02554 8.34232C3.98372 8.46815 3.9936 8.60545 4.053 8.724C4.11241 8.84255 4.21648 8.93264 4.34232 8.97446C4.46815 9.01628 4.60545 9.0064 4.724 8.947C5.09296 8.7838 5.49064 8.69543 5.894 8.687C6.36902 8.65897 6.84364 8.74826 7.276 8.947C7.51352 9.07043 7.70909 9.26154 7.83797 9.49615C7.96684 9.73077 8.02323 9.99833 8 10.265C7.54548 10.1242 7.07519 10.0406 6.6 10.016C5.76806 9.94784 4.93608 10.1468 4.225 10.584C3.82951 10.8263 3.51414 11.1797 3.31826 11.6001C3.12239 12.0205 3.05467 12.4893 3.12358 12.948C3.19248 13.4067 3.39495 13.8349 3.70572 14.1792C4.01648 14.5235 4.42177 14.7686 4.871 14.884V14.884ZM4.777 11.417C5.30955 11.1 5.92887 10.96 6.546 11.017C7.04389 11.0422 7.53464 11.1462 8 11.325V12.789C7.65336 13.2014 7.20918 13.5207 6.7078 13.7179C6.20641 13.9151 5.66372 13.9838 5.129 13.918C4.86531 13.8528 4.62715 13.7102 4.44518 13.5086C4.2632 13.3069 4.14572 13.0554 4.10787 12.7864C4.07001 12.5175 4.1135 12.2433 4.23275 11.9993C4.352 11.7552 4.54154 11.5524 4.777 11.417V11.417ZM19 16V16.5C19 16.8978 18.842 17.2794 18.5607 17.5607C18.2794 17.842 17.8978 18 17.5 18H2.5C2.10218 18 1.72064 17.842 1.43934 17.5607C1.15803 17.2794 1 16.8978 1 16.5V16C1 15.8674 1.05268 15.7402 1.14645 15.6464C1.24021 15.5527 1.36739 15.5 1.5 15.5C1.63261 15.5 1.75979 15.5527 1.85355 15.6464C1.94732 15.7402 2 15.8674 2 16V16.5C2 16.6326 2.05268 16.7598 2.14645 16.8536C2.24021 16.9473 2.36739 17 2.5 17H17.5C17.6326 17 17.7598 16.9473 17.8536 16.8536C17.9473 16.7598 18 16.6326 18 16.5V16C18 15.8674 18.0527 15.7402 18.1464 15.6464C18.2402 15.5527 18.3674 15.5 18.5 15.5C18.6326 15.5 18.7598 15.5527 18.8536 15.6464C18.9473 15.7402 19 15.8674 19 16Z' })
                    ])
                ]),
                m('button#search', {
                    title: 'Search',
                    type: 'submit'
                },
                [
                    m('svg.icon#search-icon', {
                        role: 'img', 'aria-label': 'search icon',
                        viewBox: '0 0 24 24',
                        xmlns: 'http://www.w3.org/2000/svg'
                    },
                    [
                        m('path', {
                            d: 'M10.25 2a8.25 8.25 0 0 1 6.34 13.53l5.69 5.69a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-5.69-5.69A8.25 8.25 0 1 1 10.25 2ZM3.5 10.25a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0Z'
                        })
                    ])
                ])
            ]);
        }
    };
};
