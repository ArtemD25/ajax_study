const putSuccessfullMessage = 'Updated object was successfully sent';
const putErrorMessage = 'Error occurred while sending updated object';
const deleteSuccessfullMessage = 'The object was successfully deleted';
const deleteErrorMessage = 'Error occurred while deleting this object';
const modalWindowShowTime = 2000;

fetch('https://jsonplaceholder.typicode.com/users')
.then(response => response.json())
.then(data => renderUsers(data));

function renderUsers(users) {
  const ul = createElem('ul', null, ['list']);
  ul.classList.add('list');
  document.querySelector('#root').append(ul);
  users.forEach(item => ul.append(renderSingleUser(item)));
  
  attachActionToBtn(ul);
}

function renderSingleUser(user) {
  const li = createElem('li', null, ['user'], null, {'data-userID': user.id});
  
  const name = createElem('h3', null, ['user__name', 'user__data'], user.name, {'contenteditable': 'true'});
  li.append(name);
  
  createWrapper('Username:', ['user__userName', 'user__data'], user.username, li);
  createWrapper('Email:', ['user__email', 'user__data'], user.email, li);
  createWrapper('Phone:', ['user__phone', 'user__data'], user.phone, li);
  createWrapper('Website:', ['user__website', 'user__data'], user.website, li);
  
  const addressCompanyWrap = createElem('div', null, ['addressCompanyWrap']);
  li.append(addressCompanyWrap);
  
  const addressWrap = createElem('div', null, ['addressWrap']);
  addressCompanyWrap.append(addressWrap);
  
  createWrapper('City:', ['user__city', 'user__data'], user.address.city, addressWrap);
  createWrapper('Street:', ['user__street', 'user__data'], user.address.street, addressWrap);
  createWrapper('Suite:', ['user__suite', 'user__data'], user.address.suite, addressWrap);
  createWrapper('Zip-code:', ['user__zipcode', 'user__data'], user.address.zipcode, addressWrap);
  createWrapper('Lat:', ['user__lat', 'user__data'], user.address.geo.lat, addressWrap);
  createWrapper('Lng:', ['user__lng', 'user__data'], user.address.geo.lng, addressWrap);
  
  const companyWrap = createElem('div', null, ['companyWrap']);
  addressCompanyWrap.append(companyWrap);
  
  createWrapper('Company name:', ['user__company-name', 'user__data'], user.company.name, companyWrap);
  createWrapper('Catch phrase:', ['user__catch-phrase', 'user__data'], user.company.catchPhrase, companyWrap);
  createWrapper('Bs:', ['user__bs', 'user__data'], user.company.bs, companyWrap);
  
  const buttonWrap = createElem('div', null, ['buttonWrap']);
  li.append(buttonWrap);
  
  const updateBtn = createElem('button', null, ['button', 'updateBtn'], 'Update', {'data-userID': user.id});
  const deleteBtn = createElem('button', null, ['button', 'deleteBtn'], 'Delete', {'data-userID': user.id});
  buttonWrap.append(updateBtn, deleteBtn);
  
  return li;
}

function createElem(tag, id, classes, textContent, attributes) {
  const elem = document.createElement(tag);
  if (id) {
    elem.id = id;
  }
  if (textContent) {
    elem.textContent = textContent;
  }
  if (attributes) {
    const attributesKeys = Object.keys(attributes);
    for (let i = 0; i < attributesKeys.length; i++) {
      elem.setAttribute(attributesKeys[i], attributes[attributesKeys[i]]);
    }
  }
  if (classes) {
    for (let i = 0; i < classes.length; i++) {
      elem.classList.add(classes[i]);
    }
  }
  return elem;
}

function createWrapper(captionText, classes, keyInObject, parentElement) {
  const itemWrap = createElem('div', null, ['wrap']);
  const itemCaption = createElem('p', null, ['caption'], captionText);
  const item = createElem('p', null, classes, keyInObject, {'contenteditable': 'true'});
  itemWrap.append(itemCaption, item);
  parentElement.append(itemWrap);
}

function attachActionToBtn(container) {
  container.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('updateBtn')) {
      console.log(`update ${evt.target.getAttribute('data-userID')}`);
      updateUser(evt.target.getAttribute('data-userID'));
    } else if (evt.target.classList.contains('deleteBtn')) {
      console.log(`delete ${evt.target.getAttribute('data-userID')}`);
      deleteUser(evt.target.getAttribute('data-userID'));
    }
  })
}

async function deleteUser(id) {
  const spinner = document.querySelector('.spinner');
  spinner.classList.add('show-spinner');
  let response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  spinner.classList.remove('show-spinner');
  if (response.ok) {
    displayMessage(deleteSuccessfullMessage);
    document.querySelector(`.user[data-userid='${id}']`).remove();
  } else {
    displayMessage(deleteErrorMessage);
  }
}

async function updateUser(id) {
  const spinner = document.querySelector('.spinner');
  spinner.classList.add('show-spinner');
  let response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(getUserObject(id))
  });
  spinner.classList.remove('show-spinner');
  if (response.ok) {
    displayMessage(putSuccessfullMessage);
  } else {
    displayMessage(putErrorMessage);
  }
}

function getUserObject(id) {
  const user = document.querySelector(`[data-userid='${id}']`);
  return {
    'id': id,
    'name': user.querySelector('.user__name').textContent,
    'username': user.querySelector('.user__userName').textContent,
    'email': user.querySelector('.user__email').textContent,
    'address': {
      'street': user.querySelector('.user__street').textContent,
      'suite': user.querySelector('.user__suite').textContent,
      'city': user.querySelector('.user__city').textContent,
      'zipcode': user.querySelector('.user__zipcode').textContent,
      'geo': {
        'lat': user.querySelector('.user__lat').textContent,
        'lng': user.querySelector('.user__lng').textContent
      }
    },
    'phone': user.querySelector('.user__phone').textContent,
    'website': user.querySelector('.user__website').textContent,
    'company': {
      'name': user.querySelector('.user__company-name').textContent,
      'catchPhrase': user.querySelector('.user__catch-phrase').textContent,
      'bs': user.querySelector('.user__bs').textContent
    }
  }
}

function displayMessage(message) {
  const modal = document.querySelector('#modal');
  document.querySelector('#modal__text').innerText = message;
  modal.classList.add('modal-show');
  setTimeout(() => {
    modal.classList.remove('modal-show');
  }, modalWindowShowTime);
}