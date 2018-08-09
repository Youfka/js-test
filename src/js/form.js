export default function () {
	let date, now, age, validation;
	$('.modal').hide();
	//валидация полей
	function checkIfLetters(event) {
		let regExp = /^[a-zа-яё]+$/i;
		if(regExp.test($(this).val())) {
			$(this).addClass('valid');
			$('.error').hide();
		} else {
			$('.error').show();
			$(this).removeClass('valid');
			if($(this).val() == '') {
				$('.error').text('Введите значения полей');
			} else {
				$('.error').text(event.data.string);
			}
		}
	}
	$('.js-name').on('focusout', {string: 'В имени должны быть только буквы'}, checkIfLetters);
	$('.js-surname').on('focusout', {string: 'В фамилии должны быть только буквы'}, checkIfLetters);
	$('.js-date').on('focusout', function(event){
		date = new Date($(this).val());
		now = new Date();
		if(now.getFullYear() > date.getFullYear()) {
			$('.error').hide();
			$(this).addClass('valid');
			age = now.getFullYear() - date.getFullYear();
		} else {
			$('.error').show();
			$(this).removeClass('valid');
			$('.error').text('Введите корректный год рождения');
		}
	});
	$('.js-group').on('focusout', function(event){
		let regExp = /^[a-zа-яё]{2,4}-\d-\d{2,4}$/i;
		if(regExp.test($(this).val())) {
			$(this).addClass('valid');
			$('.error').hide();
		} else {
			$('.error').show();
			$(this).removeClass('valid');
			if($(this).val() == '') {
				$('.error').text('Введите значения полей');
			} else {
				$('.error').text('Введите группу в формате: АБС-3-55');
			}
		}
	})
	function checkValidation(){
		validation = 0;
		$('.form .input').each(function(){
			if($(this).hasClass('valid')){
				validation++;
			}
		});
		return validation;
	}
	//добавление строки
	$('.js-open').on('click',function(){
		$('.modal').show();
		$('.js-change').addClass('js-add');
		$('.js-add').text('Добавить');
		$('.js-add').removeClass('js-change');

		$('.js-name').val('');
		$('.js-surname').val('');
		$('.js-date').val('');
		$('.js-group').val('');

		$('.js-add').on('click',function(){
			if(checkValidation() == 4) {
				$('.error').hide();
				$('.modal').hide();
				let form = {
					'name': $('.js-name').val(),
					'surname': $('.js-surname').val(),
					'age': age,
					'group': $('.js-group').val()
				};
				let newRow = '<tr><td><input type="checkbox" name="checkbox" class="checkbox"></td>'+
						'<td class="js-table-name">'+ form.name +'</td>'+
						'<td class="js-table-surname">'+ form.surname +'</td>'+
						'<td class="js-table-age">'+ form.age +'</td>'+
						'<td class="js-table-group">'+ form.group +'</td>'+
						'<td><button tyle="button" class="button js-open-change">Изменить</button></td></tr>';
				$('.table tbody').append(newRow);
			} else {
				if(checkValidation() != 0) {
					$('.error').show();
					$('.error').text('Убедитесь в правильном заполнении полей');
				} else {
					$('.error').show();
					$('.error').text('Заполните поля');
				}
			}
		})
	});

	$('.js-cancel').on('click',function(){
		$('.error').hide();
		$('.modal').hide();
	});


	//изменение строки
	$('.table').on('click', '.js-open-change', function(){
		$('.modal').show();
		let thisRow = $(this).closest('tr');
		let table_name = thisRow.find('.js-table-name');
		let table_surname = thisRow.find('.js-table-surname');
		let table_age = thisRow.find('.js-table-age');
		let table_group = thisRow.find('.js-table-group');
		let now = new Date();
		let date = new Date("01.02."+(now.getFullYear()-table_age.text()));
		
		$('.js-name').val(table_name.text());
		$('.js-surname').val(table_surname.text());
		$('.js-date').val(date.toISOString().substr(0, 10));
		$('.js-group').val(table_group.text());
		$('.js-add').addClass('js-change');
		$('.js-add').off();
		$('.js-change').text('Изменить');
		$('.js-change').removeClass('js-add');

		$('.js-change').on('click',function(){
			if(checkValidation() == 4) {
				$('.modal').hide();
				table_name.text($('.js-name').val());
				table_surname.text($('.js-surname').val());
				table_age.text(age);
				table_group.text($('.js-group').val());
				$('.js-change').unbind();
			} else {
				if(checkValidation() != 0) {
					$('.error').show();
					$('.error').text('Убедитесь в правильном заполнении полей');
				} else {
					$('.error').show();
					$('.error').text('Заполните поля');
				}
			}
		});

	});

	//выделение строк
	$('.table').on('change', '.checkbox', function(event){
		if(this.checked) {
			$(this).closest('tr').addClass('picked');
		} else {
			$(this).closest('tr').removeClass('picked');
		}
	})

	//удаление строк
	$('.delete').on('click', function(){
		$('.checkbox').each(function(){
			if($(this).is(':checked')){
				$(this).closest('tr').remove();
			}
		})
	});

	// поиск по фамилии
	$('.js-search').on('keyup', function() {
	  let search, tr, td;
	  search = $(this).val().toUpperCase();
	  tr = $(".table").find('tr');
	
	  for (let i = 1; i < tr.length; i++) {
	    td = $(tr[i]).find("td")[2];
	    if (td) {
	      if ($(td).text().toUpperCase().indexOf(search) > -1) {
	        $(tr[i]).show();
	      } else {
	        $(tr[i]).hide();
	      }
	    } 
	  }
	});

	//сортировка по возрасту и группе
	$('.js-sort-age').on('click', { column: 3 }, sortTable);
	$('.js-sort-group').on('click', { column: 4 }, sortTable);

	function sortTable(event) {
	  let rows, switching, i, x, y, shouldSwitch, direction, switchcount = 0;
	  switching = true;
	  direction = "fromStart"; 
	  while (switching) {
	    switching = false;
	    rows = $(".table").find('tr');
	    for (i = 1; i < (rows.length - 1); i++) {
	      shouldSwitch = false;
	      //сравниваем 2 строки
	      x = $(rows[i]).find("td")[event.data.column];
	      y = $(rows[i + 1]).find("td")[event.data.column];
	      if (direction == "fromStart") {
	        if ($(x).html().toLowerCase() > $(y).html().toLowerCase()) {
	          shouldSwitch = true;
	          break;
	        }
	      } else if (direction == "fromEnd") {
	        if ($(x).html().toLowerCase() < $(y).html().toLowerCase()) {
	          shouldSwitch = true;
	          break;
	        }
	      }
	    }
	    if (shouldSwitch) {
	      // если нужна сортировка, меняем местами
	      $(rows[i + 1]).insertBefore(rows[i]);
	      switching = true;
	      switchcount ++; 
	    } else {
	      //если не нужна сортировка в текущем напрвлении, меняем направление
	      if (switchcount == 0 && direction == "fromStart") {
	        direction = "fromEnd";
	        switching = true;
	      }
	    }
	  }
	}

}