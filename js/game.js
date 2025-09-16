class PomeranianAlienQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.correctAnswers = 0; // 正解数をカウント
        this.startTime = null;
        this.questionStartTime = null;
        this.answerTimes = [];
        this.gameState = 'start'; // 'start', 'playing', 'result'

        this.initializeElements();
        this.initializeQuestions();
        this.bindEvents();
    }

    initializeElements() {
        // 画面要素
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');

        // ボタン要素
        this.startBtn = document.getElementById('start-btn');
        this.pomeranianBtn = document.getElementById('pomeranian-btn');
        this.alienBtn = document.getElementById('alien-btn');
        this.restartBtn = document.getElementById('restart-btn');

        // ゲーム情報表示要素
        this.questionNumber = document.getElementById('question-number');
        this.timer = document.getElementById('timer');
        this.aaArt = document.getElementById('aa-art');
        this.feedback = document.getElementById('feedback');

        // リザルト表示要素
        this.totalTime = document.getElementById('total-time');
        this.finalScore = document.getElementById('final-score');
        this.accuracy = document.getElementById('accuracy');
        this.averageTime = document.getElementById('average-time');
    }

    initializeQuestions() {
        // ポメラニアンのAA（シンプルかわいく）
        const pomeranianArt = [
            "     ∩ ~~~ ∩\n     /       \\\n    | ◕   ◕  |\n    |     ω    |\n    |          |\n     \\  ~~~  /\n      ￣￣￣",
            "    ∩ ~~~ ∩\n     /       \\\n    | ●   ●  |\n    |   ◡ω◡   |\n    |         |\n     \\  ~~~ /\n      ￣￣￣",
            "   ∩ ~~~ ∩\n    ／~~~~~~~＼\n   ｜  ◕   ◕  ｜\n   ｜     ω     ｜\n    ＼  ~~~  ／\n      ￣￣￣￣",
            "     ∩ ~~~ ∩\n     /       \\\n    | ◑   ◑  |\n    |   ◡･◡   |\n    |          |\n     \\  ~~~ /\n      ￣￣￣",
            "   ∩ ~~~~ ∩\n   /~~~~~~~~~~~\\\n  |  ◕     ◕  |\n  |     ωω     |\n   \\    ~~~~  /\n     '~~~~~~~'",
            "     ∩ ~~~ ∩\n     /       \\\n    | ◕   ◕  |\n    |   ◡･◡   |\n    |          |\n     \\  ~~~ /\n      ￣￣￣",
            "    ∩ ~~~ ∩\n    ／  ~~~  ＼\n   ｜ ◕   ◕ ｜\n   ｜   ◡ω◡  ｜\n    ＼  ~~~  ／\n      ￣￣￣"
        ];

        // エイリアンのAA
        const alienArt = [
            "       ___\n     /       \\\n    | ◉   ◉  |\n    |     ^    |\n    |   ___   |\n     \\       /\n      ￣￣￣",
            "      △\n     ／￣￣￣＼\n   ／ ●     ● ＼\n  ｜       ∇     ｜\n   ＼   ‾‾‾   ／\n     ￣￣￣￣￣",
            "      ○○○\n    ／￣￣￣￣＼\n   ｜  ◎   ◎  ｜\n   ｜      ◇     ｜\n    ＼   ▽▽   ／\n      ￣￣￣￣",
            "     .-.___,-.\n   /          \\\n  | ◉       ◉ |\n  |      ^      |\n   \\    ~~~   /\n     '-.___.-'",
            "       _\n      /   \\\n     | ● ● |\n     |   △   |\n      \\ --- /\n       \\___/",
            "    ◎◎◎\n   ／￣￣￣＼\n  ｜ ▲   ▲ ｜\n  ｜    ◇    ｜\n   ＼  ~~~  ／\n     ￣￣￣",
            "      ___\n    ／     ＼\n   ｜ ◇   ◇ ｜\n   ｜    △    ｜\n    ＼  ---  ／\n      ￣￣￣"
        ];


        // 問題プールを作成
        const allQuestions = [];

        // 通常のポメラニアン問題
        pomeranianArt.forEach((art, index) => {
            allQuestions.push({
                id: `pom_${index}`,
                art: art,
                answer: 'pomeranian',
                type: 'ポメラニアン',
                isTrick: false
            });
        });

        // エイリアン問題
        alienArt.forEach((art, index) => {
            allQuestions.push({
                id: `alien_${index}`,
                art: art,
                answer: 'alien',
                type: 'エイリアン',
                isTrick: false
            });
        });


        // 問題をシャッフルして無限に出題できるようにする
        this.allQuestions = this.shuffleArray(allQuestions);
        this.questionIndex = 0;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 次の問題を取得（10問を正解するまで無限に出題）
    getNextQuestion() {
        // 現在のインデックスの問題を取得
        const question = this.allQuestions[this.questionIndex % this.allQuestions.length];
        this.questionIndex++;
        return question;
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pomeranianBtn.addEventListener('click', () => this.selectAnswer('pomeranian'));
        this.alienBtn.addEventListener('click', () => this.selectAnswer('alien'));
        this.restartBtn.addEventListener('click', () => this.restartGame());

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                if (e.key === '1' || e.key.toLowerCase() === 'p') {
                    this.selectAnswer('pomeranian');
                } else if (e.key === '2' || e.key.toLowerCase() === 'a') {
                    this.selectAnswer('alien');
                }
            } else if (this.gameState === 'start' && e.key === ' ') {
                e.preventDefault();
                this.startGame();
            }
        });
    }

    showScreen(screenName) {
        // すべての画面を非アクティブにする
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 指定された画面をアクティブにする
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.answerTimes = [];
        this.startTime = Date.now();
        this.questionIndex = 0; // 問題インデックスをリセット

        this.showScreen('game');
        this.showQuestion();
        this.startTimer();
    }

    showQuestion() {
        // 10問正解で終了
        if (this.correctAnswers >= 10) {
            this.endGame();
            return;
        }

        const question = this.getNextQuestion();
        this.currentQuestionData = question;
        this.questionStartTime = Date.now();

        // 問題番号を更新（正解数ベース）
        this.questionNumber.textContent = `正解: ${this.correctAnswers}/10 (問題${this.currentQuestion + 1})`;

        // AAを表示
        this.aaArt.textContent = question.art;

        // フィードバックをクリア
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';

        // ボタンを有効化
        this.pomeranianBtn.disabled = false;
        this.alienBtn.disabled = false;

        this.currentQuestion++;
    }

    selectAnswer(answer) {
        if (this.gameState !== 'playing') return;

        const responseTime = Date.now() - this.questionStartTime;
        this.answerTimes.push(responseTime);

        // ボタンを無効化
        this.pomeranianBtn.disabled = true;
        this.alienBtn.disabled = true;

        // 回答判定
        const isCorrect = answer === this.currentQuestionData.answer;
        if (isCorrect) {
            this.correctAnswers++;
            this.showFeedback(`正解！ ${this.currentQuestionData.type}でした`, 'correct');
        } else {
            this.showFeedback(`不正解... ${this.currentQuestionData.type}でした`, 'incorrect');
        }

        // 次の問題へ
        setTimeout(() => {
            this.showQuestion();
        }, 1500);
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (this.startTime && this.gameState === 'playing') {
                const elapsed = (Date.now() - this.startTime) / 1000;
                this.timer.textContent = `時間: ${elapsed.toFixed(2)}s`;
            }
        }, 10);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    endGame() {
        this.gameState = 'result';
        this.stopTimer();

        const totalTime = (Date.now() - this.startTime) / 1000;
        const totalQuestions = this.currentQuestion;
        const accuracy = Math.round((this.correctAnswers / totalQuestions) * 100);
        const averageResponseTime = this.answerTimes.length > 0
            ? this.answerTimes.reduce((sum, time) => sum + time, 0) / this.answerTimes.length / 1000
            : 0;

        // リザルト画面に結果を表示
        this.totalTime.textContent = `${totalTime.toFixed(2)}s`;
        this.finalScore.textContent = `${this.correctAnswers}/10正解 (計${totalQuestions}問)`;
        this.accuracy.textContent = `${accuracy}%`;
        this.averageTime.textContent = `${averageResponseTime.toFixed(2)}s`;

        this.showScreen('result');
    }

    restartGame() {
        this.gameState = 'start';
        this.initializeQuestions(); // 新しい問題セットを生成
        this.showScreen('start');
    }
}

// ゲームを初期化
document.addEventListener('DOMContentLoaded', () => {
    window.game = new PomeranianAlienQuiz();
});