// フラッシュ暗算アプリケーションの主要な機能を実装するJavaScriptファイル

document.addEventListener('DOMContentLoaded', function() {
    console.log('フラッシュ暗算アプリケーションが読み込まれました');
    
    // 要素の取得
    const digitSelect = document.getElementById('digit-select');
    const numberCount = document.getElementById('number-count');
    const displayTime = document.getElementById('display-time');
    const startButton = document.getElementById('start-button');
    const numberDisplay = document.getElementById('number-display');
    const progress = document.getElementById('progress');
    const resultArea = document.querySelector('.result-area');
    const userAnswer = document.getElementById('user-answer');
    const checkButton = document.getElementById('check-button');
    const resultDisplay = document.getElementById('result-display');
    const correctAnswer = document.getElementById('correct-answer');
    const resultMessage = document.getElementById('result-message');
    const retryButton = document.getElementById('retry-button');
    const levelButtons = document.querySelectorAll('.level-btn');
    
    // 状態管理変数
    let numbers = [];
    let currentIndex = 0;
    let sum = 0;
    let intervalId = null;
    
    // フラッシュ暗算開始
    startButton.addEventListener('click', startFlashCalculation);
    
    // 回答確認
    checkButton.addEventListener('click', checkAnswer);
    
    // リトライ
    retryButton.addEventListener('click', resetApplication);
    
    // 級・段位ボタンのクリックイベント処理
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const digit = this.dataset.digit;
            const count = this.dataset.count;
            const time = this.dataset.time;
            
            // 各値をセット
            digitSelect.value = digit;
            numberCount.value = count;
            displayTime.value = time;
            
            // ボタンのスタイルをリセット
            levelButtons.forEach(btn => btn.classList.remove('active'));
            
            // 選択されたボタンをハイライト
            this.classList.add('active');
        });
    });
    
    // フラッシュ暗算を開始する関数
    function startFlashCalculation() {
        // 設定値の取得
        const digits = parseInt(digitSelect.value);
        const count = parseInt(numberCount.value);
        const totalTime = parseInt(displayTime.value) * 1000; // ミリ秒に変換
        const timePerNumber = totalTime / count; // 1問あたりの時間
        
        // 数値の生成
        generateNumbers(digits, count);
        
        // 初期化
        currentIndex = 0;
        sum = 0;
        resultArea.style.display = 'none';
        progress.style.width = '0%';
        
        // 操作ボタンを無効化
        startButton.disabled = true;
        levelButtons.forEach(btn => btn.disabled = true);
        
        // カウントダウン処理
        let countDown = 3;
        numberDisplay.textContent = countDown;
        numberDisplay.classList.add('countdown');
        
        const countDownTimer = setInterval(() => {
            countDown--;
            
            if (countDown > 0) {
                numberDisplay.textContent = countDown;
            } else {
                // カウントダウン終了
                clearInterval(countDownTimer);
                numberDisplay.classList.remove('countdown');
                numberDisplay.textContent = '';
                
                // 少し間を空けてから表示開始
                setTimeout(() => {
                    startFlashNumbers(timePerNumber);
                }, 500);
            }
        }, 1000);
    }
    
    // 数字表示を実際に開始する関数
    function startFlashNumbers(timePerNumber) {
        // 数字表示処理の関数
        const showNextNumber = () => {
            if (currentIndex < numbers.length) {
                // 現在の数字を表示
                numberDisplay.textContent = numbers[currentIndex];
                
                // 合計に加算
                sum += numbers[currentIndex];
                
                // プログレスバー更新
                const progressPercent = ((currentIndex + 1) / numbers.length) * 100;
                progress.style.width = `${progressPercent}%`;
                
                // 次のインデックスへ
                currentIndex++;
                
                // 一定時間後に次の数字表示サイクルを開始
                setTimeout(showNextNumber, timePerNumber);
            } else {
                // 全ての数字を表示し終えたら終了
                numberDisplay.textContent = '';
                showResultArea();
                
                // 操作ボタンを再度有効化
                startButton.disabled = false;
                levelButtons.forEach(btn => btn.disabled = false);
            }
        };
        
        // 最初の数字表示を開始
        showNextNumber();
    }
    
    // 指定された桁数と問題数で数値を生成する関数
    function generateNumbers(digits, count) {
        numbers = [];
        
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        
        let lastNumber = null;
        
        for (let i = 0; i < count; i++) {
            // 指定された桁数のランダムな数値を生成（前回と異なる値になるまで繰り返す）
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (randomNumber === lastNumber);
            
            numbers.push(randomNumber);
            lastNumber = randomNumber;
        }
        
        console.log('生成された数値:', numbers);
    }
    
    // 結果エリアを表示する関数
    function showResultArea() {
        resultArea.style.display = 'block';
        resultDisplay.style.display = 'none';
        userAnswer.value = '';
        userAnswer.focus();
    }
    
    // 回答をチェックする関数
    function checkAnswer() {
        const userValue = parseInt(userAnswer.value);
        
        if (isNaN(userValue)) {
            alert('数値を入力してください');
            return;
        }
        
        correctAnswer.textContent = sum;
        resultDisplay.style.display = 'block';
        
        if (userValue === sum) {
            resultMessage.textContent = '正解です！';
            resultMessage.className = 'correct';
        } else {
            resultMessage.textContent = '不正解です。もう一度挑戦しましょう！';
            resultMessage.className = 'incorrect';
        }
    }
    
    // アプリケーションをリセットする関数
    function resetApplication() {
        // 念のため実行中のタイマーをクリア
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        
        // 全てのsetTimeoutをクリア
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
        
        // カウントダウンクラスを削除
        numberDisplay.classList.remove('countdown');
        
        // ボタンを有効化
        startButton.disabled = false;
        levelButtons.forEach(btn => btn.disabled = false);
        
        // 表示をリセット
        numberDisplay.textContent = '';
        progress.style.width = '0%';
        resultArea.style.display = 'none';
        
        // 状態をリセット
        numbers = [];
        currentIndex = 0;
        sum = 0;
    }
});