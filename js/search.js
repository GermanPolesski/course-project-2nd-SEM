let universitiesData = [];
let facultiesByField = {};

// Загрузка данных из JSON
fetch('Data/universities.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Загруженные данные:', data);
        universitiesData = data;
        facultiesByField = buildFacultiesByField(data);
        console.log('Подготовленные данные для поиска:', facultiesByField);
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
        document.getElementById('results').innerHTML = `
            <div class="university-card">
                <h3>Ошибка загрузки данных</h3>
                <p>Пожалуйста, попробуйте позже или обратитесь к администратору.</p>
            </div>
        `;
    });

function buildFacultiesByField(data) {
    const result = {};
    const fields = [
        'biology', 'physics', 'mathematics', 'chemistry',
        'informatics', 'economics', 'medicine', 'engineering',
        'philology', 'history', 'international', 'journalism',
        'architecture', 'management', 'marketing', 'tourism'
    ];
    fields.forEach(field => result[field] = []);
    
    data.forEach(uni => {
        uni.faculties.forEach(fac => {
            fac.fields.forEach(field => {
                if (result[field]) {
                    result[field].push({
                        university: uni.name,
                        faculty: fac.name,
                        score: fac.min_score,
                        address: uni.address
                    });
                }
            });
        });
    });
    return result;
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const score = parseInt(document.getElementById('score').value);
    const field = document.getElementById('field').value;
    
    console.log('Поиск по параметрам:', { score, field });
    console.log('Доступные данные для поиска:', facultiesByField);
    
    const results = document.getElementById('results');
    const fieldFaculties = facultiesByField[field] || [];
    
    console.log('Найденные факультеты для поля:', fieldFaculties);
    
    let resultsHTML = '';
    let foundResults = false;

    fieldFaculties.forEach(item => {
        console.log('Проверка факультета:', item);
        console.log('Сравнение баллов:', { 
            userScore: score, 
            requiredScore: item.score,
            difference: score - item.score
        });

        // Изменяем условие: показываем все варианты, где разница не более 30 баллов
        if (score >= item.score - 30) {
            foundResults = true;
            const difference = score - item.score;
            let admissionChance = '';
            let chanceColor = '';
            
            if (difference >= 20) {
                admissionChance = 'Очень высокий';
                chanceColor = '#27ae60';
            } else if (difference >= 10) {
                admissionChance = 'Высокий';
                chanceColor = '#2ecc71';
            } else if (difference >= 0) {
                admissionChance = 'Средний';
                chanceColor = '#f1c40f';
            } else {
                admissionChance = 'Низкий';
                chanceColor = '#e74c3c';
            }

            resultsHTML += `
                <div class="university-card">
                    <h3>${item.university} — ${item.faculty}</h3>
                    <p><strong>Проходной балл:</strong> ${item.score}</p>
                    <p><strong>Ваш балл:</strong> ${score}</p>
                    <p><strong>Разница:</strong> ${difference > 0 ? '+' : ''}${difference}</p>
                    <p><strong>Адрес:</strong> ${item.address}</p>
                    <p><strong>Шанс поступления:</strong> <span style="color: ${chanceColor}; font-weight: bold;">${admissionChance}</span></p>
                </div>
            `;
        }
    });

    if (!foundResults) {
        resultsHTML = `
            <div class="university-card">
                <h3>К сожалению, по вашему запросу ничего не найдено</h3>
                <p>Попробуйте:</p>
                <ul>
                    <li>Ввести другой балл</li>
                    <li>Выбрать другую специальность</li>
                    <li>Посмотреть все доступные специальности в каталоге ВУЗов</li>
                </ul>
            </div>
        `;
    }

    results.innerHTML = resultsHTML;
    results.classList.add('active');
});

document.querySelector('.hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('nav ul').classList.toggle('active');
}); 