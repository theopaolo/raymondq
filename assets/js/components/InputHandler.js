const API_KEY = import.meta.env.VITE_API_KEY;

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
        const textToSwap = this.textOutput.textContent;
        // send the text to mistral API
        const data = {
            "model": "mistral-small-latest",
            "messages": [
                {
                    "role": "user",
                    "content": "changer ce text comme si c'était une aventure épic : " + textToSwap
                }
            ],
            "temperature": 0.7,
            "top_p": 1,
            "max_tokens": 512,
            "stream": false,
            "safe_prompt": false,
            "random_seed": 1337
        };

        try {
            const response = await fetch('https://api.mistral.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const transformedText = result.choices[0].text; // Adjust based on the actual API response structure
            this.textOutput.textContent = transformedText;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export default inputHandler;