import React, { Component } from 'react';

class util {
  static handleQueryUrl(name="") {
    var after = window.location.hash.split("?")[1] || '';
    if (after && name) {
      var reg = new RegExp("(^|&)" + name.trim() + "=([^&]*)(&|$)");
      var r = after.trim().match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      else {
        return null;
      }
    }
  }

  static formatTime(str ="") {
    if(str.length<=1){
      return '0'+ str
    }else{
      return str
    }
  }

  static formatNowTime(type = 0) {
    let date = new Date()
    let year = this.formatTime(date.getFullYear().toString())
    let month = this.formatTime((date.getMonth()+1).toString())
    let day = this.formatTime(date.getDate().toString())
    let hour = this.formatTime(date.getHours().toString())
    let minute = this.formatTime(date.getMinutes().toString())
    let second = this.formatTime(date.getSeconds().toString())
    let formatDate = ""
    switch(type){
      case 0: 
        formatDate =  year+ '/' +month+ '/' +day+ ' ' +hour+ ':'+minute+ ':' + second
        break
      case 1: 
        formatDate = year+month+day+hour+minute+second
    }
    return formatDate
  }
}
export default util;