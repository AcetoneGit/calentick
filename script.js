document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const counter = document.getElementById('counter');
    const message = document.getElementById('message');
    const today = new Date();
    const daysInYear = 365;
    let checkedCount = 0;
    let lastCongrats = 0;
    let lastSuperCongrats = 0;
    
    // Récupérer l'état sauvegardé
    let checkedDays = JSON.parse(localStorage.getItem('checkedDays') || '{}');
    
    // Créer les cellules pour chaque jour
    for (let i = 0; i < daysInYear; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.dataset.date = dateKey;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        // Format mois sur 2 chiffres
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        dayNumber.textContent = `${date.getDate()}/${month}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = !!checkedDays[dateKey];
        if (checkbox.checked) dayCell.classList.add('checked');
        
        dayCell.appendChild(dayNumber);
        dayCell.appendChild(checkbox);
        calendar.appendChild(dayCell);
        
        // Gérer le clic sur la cellule
        dayCell.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                updateCellState(dayCell, checkbox.checked, dateKey);
            }
        });
        
        // Gérer le changement de la checkbox
        checkbox.addEventListener('change', () => {
            updateCellState(dayCell, checkbox.checked, dateKey);
        });
    }
    
    function updateCellState(cell, isChecked, dateKey) {
        if (isChecked) {
            cell.classList.add('checked');
            checkedDays[dateKey] = true;
        } else {
            cell.classList.remove('checked');
            delete checkedDays[dateKey];
        }
        localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
        updateCounterAndMessage();
        checkWeekCompletion();
        checkMonthCompletion();
    }
    
    function updateCounterAndMessage() {
        const allCheckboxes = document.querySelectorAll('.checkbox');
        checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
        counter.textContent = `${checkedCount} jour${checkedCount > 1 ? 's' : ''} complété${checkedCount > 1 ? 's' : ''}`;

        const nbSemaines = checkedCount / 7;
        const semaineMot = nbSemaines === 1 ? 'semaine' : 'semaines';

        // Messages de félicitations
        if (checkedCount > 0 && checkedCount % 28 === 0 && checkedCount !== lastSuperCongrats) {
            message.textContent = `${checkedCount} jours complétés, on continue !`;
            message.style.color = '#43a047';
            message.style.fontSize = '1.25rem';
            lastSuperCongrats = checkedCount;
        } else if (checkedCount > 0 && checkedCount % 7 === 0 && checkedCount !== lastCongrats) {
            message.textContent = `${checkedCount} jours complétés, soit ${nbSemaines} ${semaineMot} !`;
            message.style.color = '#43a047';
            message.style.fontSize = '1.1rem';
            lastCongrats = checkedCount;
        } else if (checkedCount === 0) {
            message.textContent = '';
        }
    }
    
    function checkWeekCompletion() {
        const cells = document.querySelectorAll('.day-cell');
        const weekSize = 7;
        
        for (let i = 0; i < cells.length; i += weekSize) {
            const weekCells = Array.from(cells).slice(i, i + weekSize);
            const isWeekComplete = weekCells.every(cell => 
                cell.querySelector('.checkbox').checked
            );
            
            weekCells.forEach(cell => {
                cell.classList.toggle('week-complete', isWeekComplete);
            });
        }
    }
    
    function checkMonthCompletion() {
        const cells = document.querySelectorAll('.day-cell');
        const monthSize = 28; // 4 semaines
        
        for (let i = 0; i < cells.length; i += monthSize) {
            const monthCells = Array.from(cells).slice(i, i + monthSize);
            const isMonthComplete = monthCells.every(cell => 
                cell.querySelector('.checkbox').checked
            );
            
            monthCells.forEach(cell => {
                cell.classList.toggle('month-complete', isMonthComplete);
            });
        }
    }

    // Initialiser le compteur au chargement
    updateCounterAndMessage();
    checkWeekCompletion();
    checkMonthCompletion();
}); 