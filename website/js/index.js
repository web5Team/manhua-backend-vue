$(function () {
	$('.anchor_point').click(function () {
		$(this).parent().addClass('active')
		$(this).parent().siblings().removeClass('active')
		let attr = $(this).attr('attr')
		let num = $('#' + attr).offset().top
		$("html, body").animate({
		    scrollTop: num + "px"
		}, 600);
	})
	$('.dropdown_btn').click(function () {
		tips('正在开发中')
	})
})
// 轻提示
function tips(msg) {
  if ($('.page').length <= 0) {
    var html = `
            <div class="page">
                <div class="pageContent">
                    <p class="message"></p>
                </div>
            </div>
        `
    $('body').prepend(html)
  }
  $('.message').text(msg)
  $('.page').show()
  $('.pageContent').show()
  var timer = setTimeout(function () {
    $('.pageContent').fadeOut('slow', function () {
      $('.page').hide()
      clearTimeout(timer)
    })
  }, 1000)
}

