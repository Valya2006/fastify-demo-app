const button = document.getElementById('apiButton')
const p = document.querySelector('p')
button.addEventListener('click', async () => {
  button.disabled = true
	button.textContent = 'Загрузка...'
  const response = await fetch('/api')
  const text = await response.text()
  
	if (text === 'Запрос прошел успешно') {
		button.disabled = false
	  button.textContent = 'Сделать запрос на API'
		p.textContent = 'Запрос прошел успешно ✅'
		console.log('Запрос прошел успешно')
	}
})
