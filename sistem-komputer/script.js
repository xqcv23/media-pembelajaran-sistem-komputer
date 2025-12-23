function switchTab(evt, tabName) {
    const wrapper = evt.target.closest('.modal-body-wrapper') || document; 
    wrapper.querySelectorAll('.content-section').forEach(c => c.classList.remove('active'));
    wrapper.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const targetContent = wrapper.querySelector('#' + tabName);
    if(targetContent) targetContent.classList.add('active');
    evt.currentTarget.classList.add('active');
  }

  function resizeIframe(iframe) {
      iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
      iframe.style.width = "100%";
  }

//   document.getElementById('tes').click();