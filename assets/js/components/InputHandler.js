import { OpenAI } from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ORG_ID = import.meta.env.VITE_OPENAI_ORG_ID;
const PROJECT_ID = import.meta.env.VITE_OPENAI_PROJECT_ID;
class inputHandler {
    constructor(){
        this.textInput = document.querySelector('.text-input');
        this.textOutput = document.querySelector('.text-output');
        this.styleSwap = document.querySelector('.btn-styleswap');
        this.keyCombo = [];

        if (this.textInput && this.textOutput) {
            this.init();
        } else {
            console.error('Input or output element not found.');
        }
    }

    init() {
        this.textInput.addEventListener('input', this.getText.bind(this)); // on bind le this pour avoir le this de la class
        this.styleSwap.addEventListener('click', this.swapText.bind(this));
    }

    getText() {
        if(this.textOutput.textContent.length > 20) {
            this.enableButton(this.styleSwap);
        } else {
            this.disableButton(this.styleSwap);
        }

        this.textOutput.textContent = this.textInput.value;
    }

    enableButton(button) {
        button.removeAttribute('disabled');
        this.styleSwap.classList.remove('inactive');
    }

    disableButton(button) {
        button.setAttribute('disabled', true);
        this.styleSwap.classList.add('inactive');
    }

    async swapText() {
        // this.textOutput.classList.add('fadeOut')

        // setTimeout( textOutput.classList.remove('fadeOut'), 1000);

        const textToSwap = this.textOutput.textContent;
        const promptContent = `Écris un texte court de deux phrases épique basé sur : "${textToSwap}"`;
            try {
                const openai = new OpenAI({
                    apiKey: API_KEY,
                    dangerouslyAllowBrowser: true,
                });

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: promptContent }],
                    max_tokens: 150,
                });

                const transformedText = response.choices[0].message.content;
                this.textOutput.textContent = transformedText;

            } catch (error) {
                console.error('Error:', error);
            }
    }
}

export default inputHandler;