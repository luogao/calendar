function clickShowIconPopUp (arr: string[], disabled?: boolean) {
  // arr参数是必须的
  if (!arr || !arr.length) {
    return;
  }

  document.documentElement.addEventListener('click', function (event) {
    if (disabled) return
    // 主逻辑
    let index = Math.floor(Math.random() * arr.length);
    const x = event.pageX, y = event.pageY;
    const eleText = document.createElement('span');
    eleText.className = 'text-popup';
    this.appendChild(eleText);

    // 动画结束后删除自己
    eleText.addEventListener('animationend', function () {
      eleText.parentNode && eleText.parentNode.removeChild(eleText);
    });
    // 位置
    eleText.style.left = (x - eleText.clientWidth / 2) + 'px';
    eleText.style.top = (y + eleText.clientHeight) + 'px';
    eleText.style.backgroundImage = `url('${ arr[ index ] }')`
  });
};


export default clickShowIconPopUp