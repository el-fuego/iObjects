<h1>iObjects</h1>

<b>Объекты для повседневной работы с датами, периодами, номерами карт/счетов, валютами и тд..
<ul>
<li>new iDate("30.01.2012")</li>
<li>new iPeriod("today-tomorrow")</li>
<li>new iAccount("1234 1234 1234 1234")</li>
<li>new iCurrency("usd")</li>
<li>new iMoney("1234.01")</li>
</ul>
</b>


<br>
<h2>Поддержка любых форматов входящих параметров.</h2>
В качестве рагрумета Вы можете передавать множество форматов одних и тех же данных, что довольно удобно при работе с различными сервисами посредством API.
<br>Также, iObjects в качестве аргумента могут принимать iObjects того же класса.

Даты и периоды:<br>
<ul>
<li>30.01.2012</li>
<li>30.01.12</li>
<li>30,01-12</li>
<li>01.30.2012</li>
<li>2012.30.01</li>
<li>12:48:25</li>
<li>30.01.2012 12:48</li>
<li>2012-01-30'T'12:48:25Z</li>
<li>tomorrow</li>
<li>now</li>
</ul>

Суммы:<br>
<ul>
<li>1.02</li>
<li>1,02</li>
<li>1.2</li>
<li>1001.02</li>
<li>1 001.02</li>
</ul>

Валюты:<br>
<ul>
<li>USD</li>
<li>долл.</li>
<li>долларов</li>
<li>$</li>
</ul>

Номера карт/счетов:<br>
<ul>
<li>1234123412341234</li>
<li>1234 1234 1234 1234</li>
<li>1234123412341234-1234123412341234</li>
</ul>


<br>
<h2>Форматированый вывод</h2>
Для вывода данных на страницу и отправки на сервер в едином виде, используйте методы .toString() и .toHtml()
Методы поддерживают форматы вывода 
<ul>
<li>дат и периодов: dd, mm, yyyy, yy, HH, MM, ss, l</li>
<li>сумм: разделитель дробной и основоной части, разделитель тысячных, количество цифр после мантисы</li>
<li>номеров карт/счетов: полный (1234 1234 1234 1234), скрытой средней части (1234 **** **** 1234), последних 4 цифр (** 1234) и символ разделителя</li>
</ul>


<br>
<h2>Единый формат выводимых данных во всем проекте</h2>
Для любых форматов входящих данных, методы .toString() и .toHtml() возвращают единый выходной вид.
При желании, формат вывода по умолчанию можно изменить.


<br>
<h2>Преобразование типов данных</h2>
Вы можете использовать стандартные методы для преобразования типов данных.
<ul>
<li>.toString()</li>
<li>.toHtml()</li>
<li>.toFloat()</li>
<li>.toInteger()</li>
<li>.toBoolean()</li>
</ul>


<br>
<h2>Валидация данных</h2>
В каждый класс встроена возможность проверки входящих данных при помощи метода .validate()
<ul>
<li>.toString()</li>
<li>.toHtml()</li>
<li>.toFloat()</li>
<li>.toInteger()</li>
<li>.toBoolean()</li>
</ul>


<br>
<h2>Дополнительные методы для работы с классами</h2>
Для каждого класса доступны специфические методы работы с данными, например:
<ul>
<li>Даты и периоды</li>
  <ul>
  <li>сравнение дат и их разность</li>
  <li>раздельный вывод даты и времени</li>
  <li>получение компонент даты</li>
  <li>сдвиг дат</li>
  </ul>
<br>
<li>Суммы</li>
  <ul>
  <li>получение знака</li>
  <li>получение количества копеек</li>
  </ul>
<br>
<li>Карты/счета</li>
  <ul>
  <li>является ли объект картой/счетом</li>
  <li>проверка типа платежной системы карты</li>
  <li>проверка номера карты по алгоритму Луна</li>
  </ul>
</ul>


