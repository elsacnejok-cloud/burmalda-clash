// Названия твоих будущих файлов картинок (всего 6 уникальных штук)
// Назови свои фотки точно так же (1.jpg, 2.jpg и т.д.) или переименуй строчки ниже под свои файлы
const CARDS_IMAGES = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg'
];

let cardsData = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let isLockBoard = false;

// Запуск игры
initGame();

function initGame() {
  moves = 0;
  matches = 0;
  flippedCards = [];
  isLockBoard = false;
  
  document.getElementById('movesCount').innerText = moves;
  document.getElementById('matchesCount').innerText = matches;
  document.getElementById('winBtn').style.display = 'none';

  // Дублируем массив, чтобы получить пары (6 картинок * 2 = 12 карт)
  cardsData = [...CARDS_IMAGES, ...CARDS_IMAGES];
  
  // Перемешиваем карточки случайным образом
  cardsData.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = ''; // Очищаем поле перед стартом

  // Создаём HTML-структуру ячеек
  cardsData.forEach((imageName, index) => {
    const card = document.createElement('div');
    card.classList.add('card-wrapper');
    card.dataset.image = imageName; // Запоминаем, какая картинка внутри
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">❓</div>
        <div class="card-face card-back">
          <img src="${imageName}" alt="Meme">
        </div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  if (isLockBoard) return; // Если сейчас проверяется пара, кликать нельзя
  if (this.classList.contains('flipped')) return; // Клик по уже открытой карте игнорируется
  if (this.classList.contains('matched')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  // Если открыли вторую карточку — проверяем на совпадение
  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('movesCount').innerText = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.image === card2.dataset.image;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  flippedCards[0].classList.add('matched');
  flippedCards[1].classList.add('matched');
  
  matches++;
  document.getElementById('matchesCount').innerText = matches;
  flippedCards = [];

  // Проверка на победу (если нашли все 6 пар)
  if (matches === 6) {
    setTimeout(() => {
      document.getElementById('winBtn').style.display = 'inline-block';
    }, 5000);
  }
}

function unflipCards() {
  isLockBoard = true;

  // Если не совпали, даём игроку секунду запомнить их и закрываем обратно
  setTimeout(() => {
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
    flippedCards = [];
    isLockBoard = false;
  }, 1000);
}
