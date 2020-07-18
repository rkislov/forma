const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  }
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  })


  M.Tabs.init(document.querySelectorAll('.tabs'));
  M.Sidenav.init(document.querySelectorAll('.sidenav'));

  M.FormSelect.init(document.querySelectorAll('select'));
  
 