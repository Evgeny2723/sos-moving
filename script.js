    // --- ПРИОРИТЕТ 1: Код для Multistep Form (валидация email) ---
        function isValidEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    }
    
    // 1. Находим ВСЕ формы
    const allContactForms = document.querySelectorAll('form'); 
    
    allContactForms.forEach(form => {
        // 2. Внутри КАЖДОЙ формы ищем ЕЕ email-поле и ЕЕ кнопку
        const emailField = form.querySelector('.is-email');
        
        // 3. УБЕДИТЕСЬ, ЧТО У КНОПКИ ЕСТЬ КЛАСС "is-form-button" (НЕ ID!)
        const nextButton = form.querySelector('.is-form-button'); // Ищем по КЛАССУ
    
        // 4. Если мы нашли и поле, и кнопку в этой форме, вешаем логику
        if (emailField && nextButton) {
            
            const toggleThisButton = () => {
                if (!isValidEmail(emailField.value)) {
                    nextButton.style.opacity = '0.5';
                    nextButton.style.pointerEvents = 'none';
                    emailField.classList.add('is-error');
                } else {
                    nextButton.style.opacity = '1';
                    nextButton.style.pointerEvents = 'auto';
                    emailField.classList.remove('is-error');
                }
            };
    
            toggleThisButton(); // Проверяем при загрузке
            emailField.addEventListener('input', toggleThisButton); // и при вводе
        }
    });

    // --- ПРИОРИТЕТ 2: Инициализация маски для телефонных полей ---
    addInputPhoneMask();

    // --- Код, который зависит от Webflow и jQuery ---
    const Webflow = window.Webflow || [];
    Webflow.push(function () {
        const $pagePathField = $('#page_path');
        if ($pagePathField.length) {
            $pagePathField.val(window.location.href);
            console.log("Путь страницы записан в поле:", window.location.href);
        }

    // --- ПРИОРИТЕТ 3: Инициализация datepicker и select2 для полей формы ---
    let d = new Date(), strDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    $(".is-date").datepicker({ zIndex: 1e3, autoHide: true, startDate: strDate, format: "yyyy-mm-dd" });
    $(".is-select").select2({ minimumResultsForSearch: -1, dropdownCssClass: "select-dropdown" });

    // --- ПРИОРИТЕТ 4: Код для Google Autocomplete (поля адресов) ---
    $.fn.select2.amd.define("select2/data/googleAutocompleteAdapter", ["select2/data/array", "select2/utils"], function (e, t) {
        function s(e, t) { s.__super__.constructor.call(this, e, t); }
        return (t.Extend(s, e), s.prototype.query = function (e, t) {
            var s = function (e, s) {
                console.log("ОТВЕТ ОТ GOOGLE API:", s); // Оставляем для отладки
                var a = { results: [] };
                if (s != google.maps.places.PlacesServiceStatus.OK && t(a), e.length)
                    for (var i = 0; i < e.length; i++) a.results.push({ id: e[i].place_id.toString(), text: e[i].description.toString() });
                a.results.push({ id: " ", text: "Powered by Google", disabled: true }), t(a);
            };
            if (e.term && "" != e.term) new google.maps.places.AutocompleteService().getPlacePredictions({ input: e.term }, s);
            else { var a = { results: [] }; a.results.push({ id: " ", text: "Powered by Google", disabled: true }), t(a); }
        }, s);
    });
    var googleAutocompleteAdapter = $.fn.select2.amd.require("select2/data/googleAutocompleteAdapter");
        function initSelect2AddressFields() {
                $(".is-address-autocomplate.w-input:visible").each(function () {
                    // check not already initialized (защита от двойной инициализации)
                    if (!$(this).data("select2")) {
                        $(this).select2({
                            width: "100%",
                            dataAdapter: googleAutocompleteAdapter,
                            placeholder: $(this).attr("select2-placeholder"),
                            escapeMarkup: function (e) { return e; },
                            minimumInputLength: 2,
                            templateResult: formatRepo,
                            templateSelection: formatRepoSelection,
                        }).on("select2:select", function (e) {
                            var placeId = e.params.data.id;
                            getDetails(placeId, this);
                        });
                    }
                });
            }
    
    initSelect2AddressFields();
        
    $('.is-form-button').on('click', function(){
        setTimeout(initSelect2AddressFields, 1500);
    });
        
    // --- ПРИОРИТЕТ 5: Код для обработки форм (валидация, отправка) ---
    var forms = document.querySelectorAll("form");
    forms.length && forms.forEach((e) => { e.setAttribute("novalidate", ""); });
    
    $(".blog-category-list").length && $(".blog-category-list").prepend('<div role="listitem" class="w-dyn-item"><a href="/blog" aria-current="page" class="blog-category-link w--current">All Articles</a></div>');

    $("form").length && ($("form").each(function () {
        $(this).hasClass("referer-form") || ($(this).attr("data-api-redirect", $(this).attr("redirect")), $(this).removeAttr("redirect data-redirect"));
        $(".services-hero-h1").length ? ($(this).attr("data-name", "Form in " + $(".services-hero-h1").html() + " Page."), $(this).attr("name", "Form in " + $(".services-hero-h1").html() + " Page.")) : ($(this).attr("data-name", "Form in " + $("title").text() + "."), $(this).attr("name", "Form in " + $("title").text() + "."));
    }),
    $(".bottom-cta-wrapper form").length && ($(".services-hero-section form").length ? $(".bottom-cta-wrapper form").attr("redirect", $(".services-hero-section form").attr("redirect")) : $(".bottom-cta-wrapper form").attr("redirect", "/confirmation-page")));
    
    
    // --- ИСПРАВЛЕНИЯ В SUBMIT ---
    $("form").on("submit", function (evt) {
    
    // 1. Блокируем нативную отправку Webflow
    evt.preventDefault();
    
    var $form = $(this);
    var redirectUrl = $form.attr("data-api-redirect");
    var $submitBtn = $form.find('[type="submit"]');
    var originalBtnText = $submitBtn.val();
    var $failBlock = $form.siblings(".w-form-fail");
    var $successBlock = $form.siblings(".w-form-done");
    
    // Пропускаем referer-формы
    if ($form.hasClass("referer-form")) return;
    
    // 2. Защита от двойной отправки
    if ($form.data("is-submitting")) {
        console.warn("[SOS Form] Повторная отправка заблокирована");
        return false;
    }
    
    // 3. Собираем данные формы
    var formData = formToObj($form);
    
    // =====================================================================
    // 4. ФРОНТЕНД-ВАЛИДАЦИЯ перед отправкой
    // =====================================================================
    var validationErrors = [];
    
    if (!formData.field_first_name || formData.field_first_name === "n/a") {
        validationErrors.push("Please enter your name.");
    }
    if (!formData.field_e_mail || formData.field_e_mail === "n/a") {
        validationErrors.push("Please enter your email.");
    }
    var phoneDigits = (formData.field_phone || "").replace(/\D/g, '');
    if (!formData.field_phone || formData.field_phone === "n/a" || phoneDigits.length < 9 || phoneDigits.length > 11) {
        validationErrors.push("Please enter a valid phone number.");
    }
    
    // move_size: "0" или отсутствует — форма на втором шаге, поле может быть пустым
    // Не блокируем отправку, но логируем
    if (!formData.move_size || formData.move_size === "0" || formData.move_size === 0) {
        console.warn("[SOS Form] move_size не выбран, будет отправлено как 0");
        // Раскомментируй если хочешь блокировать отправку без move_size:
        // validationErrors.push("Please select a moving size.");
    }
    
    if (validationErrors.length > 0) {
        $failBlock.html('<div style="padding: 10px;">' + validationErrors.join('<br>') + '</div>');
        $failBlock.show();
        $successBlock.hide();
        return false;
    }
    
    // 5. Ставим флаг отправки и меняем состояние кнопки
    $form.data("is-submitting", true);
    $submitBtn.val($submitBtn.data("wait") || "Sending...");
    $submitBtn.prop("disabled", true);
    $failBlock.hide();
    $successBlock.hide();
    
    // 6. Заполняем обязательные поля и дефолты
    var payload = { data: formData };
    var now = new Date();
    var todayStr = now.getFullYear() + "-" + 
                   ("0" + (now.getMonth() + 1)).slice(-2) + "-" + 
                   ("0" + now.getDate()).slice(-2);
    
    payload.data.provider_id = 50;
    payload.data.field_last_name = payload.data.field_last_name || "n/a";
    if (!payload.data.field_date) { 
        payload.data.field_date = todayStr; 
    }
    
    // Заполняем пустые поля дефолтами
    for (var key in payload.data) {
        if (payload.data[key] === null || payload.data[key] === "") {
            switch (key) {
                case "moving_from_zip":
                case "moving_to_zip":
                    payload.data[key] = "00000";
                    break;
                case "move_size":
                    payload.data[key] = 0;
                    break;
                default:
                    payload.data[key] = "n/a";
            }
        }
    }
    
    var jsonPayload = JSON.stringify(payload);
    console.log("[SOS Form] Отправка:", JSON.parse(jsonPayload));
    
    // =====================================================================
    // 7. Функции-хелперы
    // =====================================================================
    function showError(message) {
        var userMessage = message || "Something went wrong. Please try again or call us at <a href='tel:+19094430004' style='color: inherit; text-decoration: underline;'>909-443-0004</a>";
        $failBlock.html('<div style="padding: 10px;">' + userMessage + '</div>');
        $failBlock.show();
        $successBlock.hide();
        resetButton();
        
        // Скролл к ошибке
        if ($failBlock.length && $failBlock.offset()) {
            $("html, body").animate({ scrollTop: $failBlock.offset().top - 100 }, 300);
        }
    }
    
    function resetButton() {
        $submitBtn.val(originalBtnText);
        $submitBtn.prop("disabled", false);
        $form.data("is-submitting", false);
    }
    
    // =====================================================================
    // 8. AJAX запрос
    // =====================================================================
    $.ajax({
        url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
        type: "POST",
        dataType: "text",
        data: jsonPayload,
        contentType: "application/json",
        timeout: 30000, // 30 секунд — API иногда отвечает медленно
        
        success: function (responseText, textStatus, xhr) {
            console.log("[SOS Form] Response:", responseText);
            
            var response;
            try {
                response = JSON.parse(responseText);
            } catch (e) {
                showError("Server returned an unexpected response. Please try again.");
                return;
            }
            
            if (response.status === true || response.status === "true") {
                // ✅ Успех
                console.log("[SOS Form] ✅ Лид принят CRM");
                resetButton();
                if (redirectUrl) {
                    window.location = redirectUrl;
                } else {
                    $successBlock.show();
                    $failBlock.hide();
                    $form.hide();
                }
            } else {
                // ❌ CRM вернула ошибку (status: false)
                var msg = response.status_message || response.message || response.error ||
                          "Your request could not be processed. Please try again.";
                showError(msg);
            }
        },
        
        error: function (xhr, textStatus, errorThrown) {
            console.error("[SOS Form] Error:", textStatus, xhr.status, xhr.responseText);
            
            var errorMessage;
            
            // Пробуем достать сообщение из ответа (если CORS пропустил)
            if (xhr.responseText) {
                try {
                    var errResp = JSON.parse(xhr.responseText);
                    errorMessage = errResp.status_message || errResp.message || errResp.error;
                } catch (e) {}
            }
            
            if (!errorMessage) {
                if (textStatus === "timeout") {
                    errorMessage = "The server is taking too long to respond. Please try again in a moment.";
                } else if (xhr.status === 400) {
                    errorMessage = "Some required information is missing or invalid. Please check your details and try again.";
                } else if (xhr.status >= 500) {
                    errorMessage = "Server error. Please try again later or call us at <a href='tel:+19094430004' style='color: inherit; text-decoration: underline;'>909-443-0004</a>";
                } else {
                    errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
                }
            }
            
            showError(errorMessage);
        }
    });
    
    return false;
});
        
        // --- ПРИОРИТЕТ 6: Код для Slick Slider (свайпер) ---
        if ($(".is-have-slider").length) {
            let slidersArr = [];
            $(".is-have-slider").each(function (e) {
                let t = $(this);
                slidersArr[e] = {
                    slider: t.find(".slider"),
                    slides: t.find(".slide"),
                    slidesCount: t.find(".slide").length,
                    sliderDots: t.find(".slider-dots"),
                    autoplay: !!t.find(".slider").data("autoplay"),
                    variableWidth: !!t.find(".slider").data("variablewidth"),
                    variableWidthMobile: t.find(".slider").data("variablewidthmobile") !== false,
                    doubleSlides: t.find(".slider").data("doubleslides") !== false,
                    slidesToShow: t.find(".slider").data("slidestoshow") || 1,
                    slidesToShowTablet: t.find(".slider").data("slidestoshowtablet") || 1,
                    slidesToShowMobile: t.find(".slider").data("slidestoshowmobile") || 1,
                };
                if (slidersArr[e].slidesCount < 7 && slidersArr[e].doubleSlides) {
                    slidersArr[e].slides.each(function () {
                        $(this).clone().appendTo(slidersArr[e].slider);
                    });
                }
                slidersArr[e].slider.slick({
                    infinite: true,
                    slidesToShow: slidersArr[e].slidesToShow,
                    variableWidth: slidersArr[e].variableWidth,
                    slidesToScroll: 1,
                    autoplay: slidersArr[e].autoplay,
                    autoplaySpeed: 2000,
                    nextArrow: t.find(".is-next"),
                    prevArrow: t.find(".is-prev"),
                    dots: false,
                    appendDots: slidersArr[e].sliderDots,
                    draggable: true,
                    responsive: [
                        { breakpoint: 991, settings: { slidesToShow: slidersArr[e].slidesToShowTablet } },
                        { breakpoint: 768, settings: { variableWidth: slidersArr[e].variableWidthMobile, slidesToShow: slidersArr[e].slidesToShowMobile } },
                    ],
                });
            });
        }

        // --- ПРИОРИТЕТ 7: Код для navbar (навбар) ---
        const nav = $(".navbar");
        window.addEventListener("scroll", function (e) {
            let t = e.target.scrollingElement.scrollTop;
            t > 10 ? nav.hasClass("is-fixed") || nav.addClass("is-fixed") : nav.hasClass("is-fixed") && nav.removeClass("is-fixed");
        });

        // --- ПРИОРИТЕТ 8: Dropdown функциональность ---
        $(".article-content-area").length && $(".article-content-area").each(function () {
          //  openDropdown($(this).find(".dropdown").eq(0));
        });

        $("body").on("click", ".dropdown-toggle", function () {
            let e = $(this).parent(".dropdown");
            e.hasClass("is--open") ? closeDropdown(e) : openDropdown(e), closeDropdown(e.siblings(".is--open"));
        });

        // --- Остальные второстепенные функции ---
        
        // Код для пагинации
        if ($(".w-page-count").length) {
            let e = $(window).width() < 768 ? 4 : 10;
            $(".w-page-count").each(function () {
                let t = $(this).closest(".w-pagination-wrapper").find('[class*="w-pagination"]').first().prop("href").split("=")[0],
                    s = parseInt(/[^/]*$/.exec($(this).text())[0].trim()),
                    a = parseInt($(this).text().split("/")[0].trim()),
                    i = Math.max(1, Math.min(e || s, s)),
                    o = Math.min(Math.max(1, a - Math.ceil((i - 1) / 2)) + (i - 1), s),
                    r = o - (i - 1);
                $(this).empty();
                for (let l = r; l <= o; l++) {
                    let n = l, c = t + "=" + n, p = n == a,
                        u = $("<a>", { class: [p && "is-current", "page-link"].filter(Boolean).join(" "), href: c, text: n });
                    $(this).append(u);
                }
            });
        }

        $(".reviews-collection-grid").masonry({ itemSelector: ".reviews-collection-item" });

        // Остальной код из Webflow.push
        $(".services-section + .why-sos-section").length && $(".services-section").addClass("is-mb-0");
        $(".service-content-section + .services-section").length && $(".services-section").prev(".service-content-section").addClass("is-mb-0");
        $(".services-section + .hero-form-section").length && $(".services-section").addClass("is-small-pb");
        $(".article-content-area p").each(function () {
            $(this).html().indexOf("{separator}") > -1 && $(this).html("").addClass("separator");
        });
        $(".article-content-area h2").each(function (e) {
            let t = $(".article-toc-list"), s = 97 + e, a = $(this).html();
            a.indexOf(". ") > -1 && (a = a.split(". ")[1]), $(this).attr("id", String.fromCharCode(s)), t.append('<li class="article-toc-item"><a href="#' + String.fromCharCode(s) + '" class="article-toc-link">' + a + "</a></li>");
        });

        // GSAP анимации
        gsap.registerPlugin(ScrollTrigger);

        // --- АНИМАЦИЯ ОТДЕЛЬНЫХ ЛИНИЙ ---
        const lineFills = gsap.utils.toArray(".steps-line-fill");
        lineFills.forEach(line => {
          const triggerElement = line.closest(".step-item");
          gsap.fromTo(line, 
                      { height: "0%" },
                      {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: triggerElement,
              start: "top 40%",
              end: "bottom 40%",
              scrub: true,
            }
          }
                     );
        });

        // --- АНИМАЦИЯ ЦИФР (OPACITY И ПУЛЬСАЦИЯ) ---
        const steps = gsap.utils.toArray(".step-item");
        steps.forEach((step, index) => {
          const number = step.querySelector(".step-number");
          if (number) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: step,
                start: "top 40%",
                end: "bottom 40%",
                scrub: 0.8,
              }
            });
            tl.to(number, {
              opacity: 1,
              scale: 1.15,
              duration: 0.3
            })
              .to(number, {
              scale: 1,
              duration: 0.7
            });
          }
        });
    });

// --- ОБЪЯВЛЕНИЯ ВСЕХ ФУНКЦИЙ ---
function addInputPhoneMask() {
    let e = document.querySelectorAll("input.is-phone"), t = /\D/g, s = (e) => e.value.replace(t, ""),
        a = (e) => {
            let a = e.target, i = s(a), o = "", { selectionEnd: r, selectionStart: l } = a;
            if (!i) { a.value = ""; return; }
            a.value.length !== l && e.data && t.test(e.data) && (a.value = i),
            i.length > 0 && (o += `(${i.substring(0, 3)}`), i.length >= 4 && (o += `) ${i.substring(3, 6)}`),
            i.length >= 7 && (o += `-${i.substring(6, 8)}`), i.length >= 9 && (o += `${i.substring(8, 10)}`),
            i.length >= 11 && (o = `${i.substring(0, 16)}`);
            let n = getNewCaretPosition(i, o);
            a.value = o, a.setSelectionRange(n, n);
        },
        i = (e) => { let t = e.target, s = t.value.replace(/\D/g, ""); 8 === e.keyCode && 1 === s.length && (t.value = ""); },
        o = (e) => { let a = e.target, i = s(a), o = e.clipboardData || window.Clipboard; if (o) { let r = o.getData("Text"); t.test(r) && (a.value = i); } },
        r = (e) => { let t = e.target; t.classList.contains("focus") || setTimeout(() => { t.selectionStart = t.value.length; }, 100), t.classList.add("focus"); },
        l = (e) => { let t = e.target; t.classList.remove("focus"); },
        n = (e) => {
            selectedNumberCount = Math.abs(e.target.value.slice(e.target.selectionStart, e.target.selectionEnd).replaceAll(/\s/g, "").length),
            prevRawNumber = e.target.value.replaceAll(/\D/g, ""),
            prevNumberCaretPosition = e.target.value.slice(0, e.target.selectionStart).replaceAll(/\D/g, "").length;
        };
    e.forEach((e) => { e.addEventListener("input", a, !1), e.addEventListener("keydown", i), e.addEventListener("paste", o, !1), e.addEventListener("focus", r, !1), e.addEventListener("focusout", l, !1), e.addEventListener("beforeinput", n, !1); });
}
function getNewCaretPosition(e, t) {
    let s = t.split(""), a = 0, i = prevNumberCaretPosition + (e.length - prevRawNumber.length + selectedNumberCount), o;
    for (o = 0; o <= s.length - 1 && a !== i; o++) /\d/.test(s[o]) && ++a;
    return o;
}
function openDropdown(e) { let t = e.find(".dropdown-content-wrapper"); t.css({ height: t.find("div").innerHeight(), opacity: 1 }), e.addClass("is--open"); }
function closeDropdown(e) { e.find(".dropdown-content-wrapper").css({ height: 0, opacity: 0 }), e.removeClass("is--open"); }
function formatRepo(e) { return e.loading ? e.text : "<div class='select2-result-repository clearfix'><div class='select2-result-title'>" + e.text + "</div>"; }
function formatRepoSelection(e) { return e.text; }
function getDetails(placeId, element) {
    if (!placeId || placeId.trim() === "") {
        console.warn("getDetails: получен неверный placeId, запрос не выполнен.");
        return; 
    }

    (new google.maps.Geocoder()).geocode({ 'placeId': placeId }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                let a = extractComponents(results[0]); 
                let zip = a.postal_code ? a.postal_code : "00000"; 
                let fullAddress = a.formatted_address; 
                let $element = $(element);

                // Text = что видит пользователь (полный адрес)
                // Value = что уйдет на сервер (ZIP-код)
                var newOption = new Option(fullAddress, zip, true, true);

                $element.empty(); 
                $element.append(newOption);
                
                // --- ИСПРАВЛЕНИЕ 3: Принудительно устанавливаем .val() ---
                // Это гарантирует, что formToObj() получит ZIP-код
                $element.val(zip); 
                
                $element.trigger('change'); 

            } else {
                window.alert("Geocoder: No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status); 
        }
    });
}
function extractComponents(e) {
    for (var t = { street_number: "short_name", route: "long_name", locality: "long_name", administrative_area_level_1: "short_name", country: "long_name", postal_code: "short_name" },
        s = { google_place_id: e.place_id, formatted_address: e.formatted_address, city: "", state: "", country: "", postal_code: "", lat: e.geometry.location.lat(), lng: e.geometry.location.lng() },
        a = 0; a < e.address_components.length; a++) {
        var i = e.address_components[a].types[0];
        if (t[i]) {
            var o = e.address_components[a][t[i]];
            "locality" === i ? s.city = o : "administrative_area_level_1" === i ? s.state = o : "country" === i ? s.country = o : "postal_code" === i && (s.postal_code = o);
        }
    }
    return s;
}
function formToObj(e) {
    var t = e.serializeArray(), s = {};
    $.each(t, function () {
        // Убираем суффиксы -2, -3 и т.д. из имён полей Webflow
        var cleanName = this.name.replace(/-\d+$/, '');
        // Если поле с таким именем уже есть и не пустое — не перезаписываем
        if (!s[cleanName] || !s[cleanName].length) {
            s[cleanName] = this.value || null;
        }
    });
    return s;
}
