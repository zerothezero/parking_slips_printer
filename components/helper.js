import {format} from 'date-fns';
import {th} from 'date-fns/locale';
import {ToastAndroid} from 'react-native';

export function formatNumber(string) {
	return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function itemToArray(rows) {
	let arr = [], i;
	if (rows.length > 0) {
		for (i = 0; i < rows.length; i++) {
			arr.push(rows.item(i));
		}
	}

	return arr;
}

// control array size
// 1. push() + shift()
// 2. splice(0,0, $) + pop()
// 3. unshift() + pop() **
export function setPlates(plates, plate) {
	plates.unshift(plate);
	if (plates.length > 5) {
		plates.pop();
	}
}

export function dt_now() {
	return format(new Date(), 'dd/MM/yyyy HH:mm:ss', {locale: th});
}

export function dt_now_sql() {
	return format(new Date(), 'TT', {locale: th});
}

export function dt_format(timestamp, dateformat = 'dd/MM/yyyy HH:mm:ss') {
	return format(timestamp, dateformat, {locale: th});
}

export function toast(text, time = ToastAndroid.LONG) {
	ToastAndroid.show(text, time);
}

export function getError(obj) {
	if ('string' === typeof obj) {
		return obj;
	} else {
		if ('message' in obj) {
			return obj.message;
		} else {
			return obj;
		}
	}
}
