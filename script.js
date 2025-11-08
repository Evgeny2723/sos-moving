    // --- ПРИОРИТЕТ 1: Код для Multistep Form (валидация email) ---
    const emailField = document.querySelector('[name="field_e_mail"]') || document.getElementById('field_e_mail');
    const nextButton = document.querySelector('#next-step-btn');

    function isValidEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    }

    function toggleNextButton() {
        if (!isValidEmail(emailField.value)) {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
            emailField.classList.add('is-error');
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
            emailField.classList.remove('is-error');
        }
    }

    if (emailField && nextButton) {
        toggleNextButton();
        emailField.addEventListener('input', toggleNextButton);
    }

    // --- ПРИОРИТЕТ 2: Инициализация маски для телефонных полей ---
    addInputPhoneMask();

    // --- Код, который зависит от Webflow и jQuery ---
    const Webflow = window.Webflow || [];
    Webflow.push(function () {

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
    var $select = $(".is-address-autocomplate");
    $select.each(function () {
        $(this).select2({
            width: "100%", dataAdapter: googleAutocompleteAdapter, placeholder: $(this).attr("select2-placeholder"),
            escapeMarkup: function (e) { return e; },
            minimumInputLength: 2, templateResult: formatRepo, templateSelection: formatRepoSelection,
        }); // <-- Убрана ; или , (синтаксическая ошибка)
    
        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Мы привязываем обработчик 'select2:select' отдельно
        // и используем e.params.data.id для получения placeId
        $(this).on("select2:select", function (e) {
            // Правильный способ получить placeId из select2
            var placeId = e.params.data.id; 
            
            // 'this' - это оригинальный <input> или <select>
            getDetails(placeId, this);      
        });
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
    
    $("form").on("submit", function () {
        var e = $(this), s = e.attr("data-api-redirect"), a = e.find('[type="submit"]'), i = a.val();
        if (e.hasClass("referer-form")) return;
        a.val(a.data("wait"));
        var t = { data: formToObj(e) };
        var o = new Date();
        var r = o.getFullYear() + "-" + ("0" + (o.getMonth() + 1)).slice(-2) + "-" + ("0" + o.getDate()).slice(-2);
        t.data.provider_id = 50;
        t.data.field_last_name = "n/a";
        if (!t.data.field_date) { t.data.field_date = r; }
        for (const key in t.data) {
            if (t.data[key] === null || t.data[key] === "") {
                switch (key) {
                    case "moving_from_zip": case "moving_to_zip": t.data[key] = "00000"; break;
                    case "move_size": t.data[key] = 0; break;
                    default: t.data[key] = "n/a";
                }
            }
        }
        t = JSON.stringify(t);
        console.log("Отправляемые данные:", t);
        var l = $(this).siblings(".w-form-fail");
        $.ajax({
            url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
            type: "POST", dataType: "text", data: t, contentType: "application/json",
            statusCode: { 400: function (e) { var t = JSON.parse(e); l.html(t.status_message), l.show(), a.val(i); } },
            success: function (e) { var t = JSON.parse(e); t.status ? (window.location = s) : (l.html(t.status_message), l.show()), a.val(i); },
            error: function (e, t, s) { l.html(t.status_message), l.show(), a.val(i); },
        });
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
    // 1. ЗАЩИТА: Проверяем, что к нам пришел настоящий ID, а не " " или пустая строка
    if (!placeId || placeId.trim() === "") {
        console.warn("getDetails: получен неверный placeId, запрос не выполнен.");
        return; // Останавливаем функцию
    }

    (new google.maps.Geocoder()).geocode({ 'placeId': placeId }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                // 2. ИЗВЛЕКАЕМ ДАННЫЕ
                let a = extractComponents(results[0]); // Ваша функция extractComponents
                let zip = a.postal_code ? a.postal_code : "00000"; // Получаем ZIP
                let fullAddress = a.formatted_address; // Получаем полный адрес
                let $element = $(element);

                // 3. ОБНОВЛЯЕМ SELECT2 (ГЛАВНОЕ ИСПРАВЛЕНИЕ)
                
                // Создаем новый, *правильный* <option>
                // new Option(Text, Value, defaultSelected, Selected)
                // Text = что видит пользователь (полный адрес)
                // Value = что уйдет на сервер (ZIP-код)
                var newOption = new Option(fullAddress, zip, true, true);

                // 4. ОЧИЩАЕМ ПОЛЕ
                // Удаляем все старые <option> (тот самый "непонятный список")
                $element.empty(); 
                
                // 5. ВСТАВЛЯЕМ НОВЫЙ OPTION
                // Добавляем наш новый, единственный и правильный <option>
                $element.append(newOption);
                
                // 6. ОБНОВЛЯЕМ SELECT2
                // Говорим select2, чтобы он перечитал <input> и обновил свой внешний вид
                $element.trigger('change'); 

            } else {
                window.alert("Geocoder: No results found");
            }
        } else {
            // Если что-то пошло не так, мы увидим ошибку
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
    return ($.each(t, function () { s[this.name] = this.value || null; }), s);
}
