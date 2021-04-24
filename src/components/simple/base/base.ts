import 'air-datepicker/dist/css/datepicker.min.css';
import 'air-datepicker/dist/js/datepicker.min.js';

const datepiker: HTMLDivElement = document.getElementsByClassName('js-datepiker')[0] as HTMLDivElement;
const datepickerOptions = {
  range: true,
  toggleSelected: false,
  multipleDatesSeparator: ' - ',

};
($(datepiker) as unknown as { datepicker: (options?: any) => any }).datepicker(datepickerOptions);
const q = $(datepiker).data('datepicker');
console.log(q);
