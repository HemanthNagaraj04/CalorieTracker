(function() {
    const form = document.getElementById('food-form');
    const foodInput = document.getElementById('food-name');
    const quantityInput = document.getElementById('quantity');
    const macroPreview = document.getElementById('macro-preview');
    const addBtn = document.getElementById('add-btn');
    const foodList = document.getElementById('food-list');
    const totalDisplay = document.getElementById('total-calories');
    const loadingEl = document.getElementById('loading');
  
    let foods = JSON.parse(localStorage.getItem('calorieTrackerFoods') || '[]');
    let currentMacros = null;
  
    const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  
    const updateTotal = () => {
      let cals = 0, p = 0, f = 0, c = 0;
      foodList.innerHTML = foods.length ? '' : '<p style="text-align:center;color:#888;">No food logged yet.</p>';
  
      foods.forEach(({ name, quantity, macros }, i) => {
        cals += macros.calories; p += macros.protein; f += macros.fat; c += macros.carbs;
        const el = document.createElement('div');
        el.className = 'food-item';
        el.innerHTML = `
          <div class="food-info">
            <div class="food-name">${escapeHtml(name)}</div>
            <div class="food-details">${quantity} serving${quantity > 1 ? 's' : ''}</div>
          </div>
          <div class="macro-details">
            ${macros.calories.toFixed(0)} kcal<br>
            P: ${macros.protein.toFixed(1)}g | F: ${macros.fat.toFixed(1)}g | C: ${macros.carbs.toFixed(1)}g
          </div>
          <button class="delete-btn" data-index="${i}">&times;</button>
        `;
        foodList.appendChild(el);
      });
  
      totalDisplay.textContent = `Total Calories: ${cals.toFixed(0)} kcal | Protein: ${p.toFixed(1)} g | Fat: ${f.toFixed(1)} g | Carbs: ${c.toFixed(1)} g`;
    };
  
    const fetchMacros = async (desc) => {
      loadingEl.style.display = 'block';
      macroPreview.classList.add('hidden');
      addBtn.disabled = true;
      try {
        const res = await fetch('https://your-proxy-name.onrender.com/api/nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: desc })
          });
        const data = await res.json();
        const { foods: items } = data;
        if (!items.length) throw new Error('No macro data found');
        const sum = items.reduce((a, b) => ({
          calories: a.calories + (b.nf_calories || 0),
          protein: a.protein + (b.nf_protein || 0),
          fat: a.fat + (b.nf_total_fat || 0),
          carbs: a.carbs + (b.nf_total_carbohydrate || 0),
        }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  
        currentMacros = sum;
        macroPreview.innerHTML = `<strong>Estimated:</strong><br>Calories: ${sum.calories.toFixed(0)} kcal | Protein: ${sum.protein.toFixed(1)}g | Fat: ${sum.fat.toFixed(1)}g | Carbs: ${sum.carbs.toFixed(1)}g`;
        macroPreview.classList.remove('hidden');
        addBtn.disabled = false;
      } catch (e) {
        macroPreview.textContent = `Error: ${e.message}`;
        macroPreview.classList.remove('hidden');
      }
      loadingEl.style.display = 'none';
    };
  
    const debounce = (fn, delay = 700) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
      };
    };
  
    const onInputChange = debounce(() => {
      const food = foodInput.value.trim();
      const qty = parseFloat(quantityInput.value);
      if (!food || isNaN(qty) || qty <= 0) return;
      fetchMacros(qty > 1 ? `${qty} ${food}` : food);
    });
  
    form.addEventListener('input', onInputChange);
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = foodInput.value.trim();
      const qty = parseFloat(quantityInput.value);
      if (!name || isNaN(qty) || !currentMacros) return;
      foods.push({ name, quantity: qty, macros: currentMacros });
      localStorage.setItem('calorieTrackerFoods', JSON.stringify(foods));
      updateTotal();
      form.reset();
      macroPreview.classList.add('hidden');
      addBtn.disabled = true;
      foodInput.focus();
    });
  
    foodList.addEventListener('click', e => {
      if (e.target.classList.contains('delete-btn')) {
        const index = +e.target.dataset.index;
        foods.splice(index, 1);
        localStorage.setItem('calorieTrackerFoods', JSON.stringify(foods));
        updateTotal();
      }
    });
  
    updateTotal();
  })();