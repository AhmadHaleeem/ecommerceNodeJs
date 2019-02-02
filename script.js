(function modifyDom() {
  const authors = [
    { key: 'aakerlund', givenname: 'Johan', familyname: 'Aakerlund' },
    { key: 'aas', givenname: 'American Astronomical Society', familyname: '' },
    { key: 'aavatsmark', givenname: 'Ivar', familyname: 'Aavatsmark' },
    { key: 'abhinandan', givenname: 'S. P.', familyname: 'Abhinandan' },
    { key: 'abraham', givenname: 'Paul', familyname: 'Abraham' },
    { key: 'abrahams', givenname: 'Paul W.', familyname: 'Abrahams' },
  ];
  let li;
  for (const author of authors) {
    li = document.querySelector('#book-list');

    li.innerHTML += `
        <tr>
          <td><a href="#" class="delete">X</a>
          <p>${author.givenname}</p></>
        </tr>
        <br/>
    `;
  }
  document.body.appendChild(li);
})();

const myElem = document.querySelector('#book-list');
myElem.addEventListener('click', item => {
  deleteItem(item.target);
});

function deleteItem(el) {
  if (el.classList.contains('delete')) {
    el.parentElement.parentElement.remove();
  }
}

// const newPromise = new Promise((resolve, reject) => {
//   resolve('Done');

// });
