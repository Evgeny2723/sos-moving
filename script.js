const Webflow = window.Webflow || [];
function addInputPhoneMask() {
    let e = document.querySelectorAll("input.is-phone"),
        t = /\D/g,
        s = (e) => e.value.replace(t, ""),
        a = (e) => {
            let a = e.target,
            	i = s(a),
            	o = "",
            	{ selectionEnd: r, selectionStart: l } = a;
            if (!i) {
            	a.value = "";
            	return;
            }
            a.value.length !== l && e.data && t.test(e.data) && (a.value = i),
            	i.length > 0 && (o += `(${i.substring(0, 3)}`),
            	i.length >= 4 && (o += `) ${i.substring(3, 6)}`),
            	i.length >= 7 && (o += `-${i.substring(6, 8)}`),
            	i.length >= 9 && (o += `${i.substring(8, 10)}`),
            	i.length >= 11 && (o = `${i.substring(0, 16)}`),
            	10 == i.length ? a.classList.add("valid") : a.classList.remove("valid");
            let n = getNewCaretPosition(i, o);
            (a.value = o), a.setSelectionRange(n, n);
        },
        i = (e) => {
        	let t = e.target,
        		s = t.value.replace(/\D/g, "");
        	8 === e.keyCode && 1 === s.length && (t.value = "");
        },
        o = (e) => {
        	let a = e.target,
        		i = s(a),
        		o = e.clipboardData || window.Clipboard;
        	if (o) {
        		let r = o.getData("Text");
        		t.test(r) && (a.value = i);
        	}
        },
        r = (e) => {
        	let t = e.target;
        	t.classList.contains("focus") ||
        		setTimeout(() => {
        			t.selectionStart = t.value.length;
        		}, 100),
        		t.classList.add("focus");
        },
        l = (e) => {
        	let t = e.target;
        	t.classList.remove("focus");
        },
        n = (e) => {
        	(selectedNumberCount = Math.abs(e.target.value.slice(e.target.selectionStart, e.target.selectionEnd).replaceAll(/\s/g, "").length)),
        		(prevRawNumber = e.target.value.replaceAll(/\D/g, "")),
        		(prevNumberCaretPosition = e.target.value.slice(0, e.target.selectionStart).replaceAll(/\D/g, "").length);
        };
    e.forEach((e) => {
    	e.addEventListener("input", a, !1), e.addEventListener("keydown", i), e.addEventListener("paste", o, !1), e.addEventListener("focus", r, !1), e.addEventListener("focusout", l, !1), e.addEventListener("beforeinput", n, !1);
    });
}
function getNewCaretPosition(e, t) {
    let s = t.split(""),
    	a = 0,
    	i = prevNumberCaretPosition + (e.length - prevRawNumber.length + selectedNumberCount),
    	o;
    for (o = 0; o <= s.length - 1 && a !== i; o++) /\d/.test(s[o]) && ++a;
    return o;
}
function removeErrorClassOnInput(e) {
    e.addEventListener("input", () => {
    	e.classList.remove("is-error");
    }),
    	"radio" == e.type &&
    		e.addEventListener("click", () => {
    			document.querySelectorAll(`[name=${e.dataset.name}]`).length &&
    				document.querySelectorAll(`[name=${e.dataset.name}]`).forEach((e) => {
    					e.classList.remove("is-error");
    				});
    		}),
    	e.addEventListener("focus", () => {});
}
function formValidation(e) {
    let t = !0,
    	s = e.querySelectorAll('input, select, [type="radio"]');
    return (
    	s.forEach((e) => {
    		let { value: s, dataset: a } = e;
    		e.classList.remove("is-error"),
    			e.classList.contains("is-phone") && !e.classList.contains("valid") && (e.classList.add("is-error"), (t = !1)),
    			"true" === a.required &&
    				(s || (e.classList.add("is-error"), (t = !1)),
    				"radio" == e.type &&
    					!document.querySelector(`[name=${e.dataset.name}]:checked`) &&
    					(document.querySelectorAll(`[name=${e.dataset.name}]`).forEach((e) => {
    						e.classList.add("is-error");
    					}),
    					selectToggle && selectToggle.classList.add("is-error")));
    	}),
    	t
    );
}
function checkValidationFormOnSubmit(e) {
    let t = document.querySelector(e),
    	s = t.querySelectorAll('input, select, [type="radio"]'),
    	a = (e) => !!formValidation(t);
    s.forEach((e) => {
    	let t = e.getAttribute("data-required");
    	t && removeErrorClassOnInput(e);
    }),
    	$(e).submit(a);
}
Webflow.push(function () {
    $(".is-have-slider").length &&
    	((slidersArr = []),
    	$(".is-have-slider").each(function (e) {
    		let t = $(this);
    		(slidersArr[e] = {
    			slider: t.find(".slider"),
    			slides: t.find(".slide"),
    			slidesCount: t.find(".slide").length,
    			sliderDots: t.find(".slider-dots"),
    			autoplay: !!t.find(".slider").data("autoplay"),
    			variableWidth: !!t.find(".slider").data("variablewidth"),
    			variableWidthMobile: !1 != t.find(".slider").data("variablewidthmobile"),
    			doubleSlides: !1 != t.find(".slider").data("doubleslides"),
    			slidesToShow: t.find(".slider").data("slidestoshow") ? t.find(".slider").data("slidestoshow") : 1,
    			slidesToShowTablet: t.find(".slider").data("slidestoshowtablet") ? t.find(".slider").data("slidestoshowtablet") : 1,
    			slidesToShowMobile: t.find(".slider").data("slidestoshowmobile") ? t.find(".slider").data("slidestoshowmobile") : 1,
    		}),
    			slidersArr[e].slidesCount < 7 &&
    				slidersArr[e].doubleSlides &&
    				slidersArr[e].slides.each(function () {
    					$(this).clone().appendTo(slidersArr[e].slider);
    				}),
    			slidersArr[e].slider.slick({
    				infinite: !0,
    				slidesToShow: slidersArr[e].slidesToShow,
    				variableWidth: slidersArr[e].variableWidth,
    				slidesToScroll: 1,
    				autoplay: slidersArr[e].autoplay,
    				adaptiveHeight: !0,
    				autoplaySpeed: 2e3,
    				nextArrow: t.find(".is-next"),
    				prevArrow: t.find(".is-prev"),
    				dots: 1 == slidersArr[e].sliderDots.length,
    				appendDots: slidersArr[e].sliderDots,
    				responsive: [
    					{ breakpoint: 991, settings: { slidesToShow: slidersArr[e].slidesToShowTablet } },
    					{ breakpoint: 768, settings: { variableWidth: slidersArr[e].variableWidthMobile, slidesToShow: slidersArr[e].slidesToShowMobile } },
    				],
    			});
    	})),
    	$(".services-section + .why-sos-section").length && $(".services-section").addClass("is-mb-0"),
    	$(".service-content-section + .services-section").length && $(".services-section").prev(".service-content-section").addClass("is-mb-0"),
    	$(".services-section + .hero-form-section").length && $(".services-section").addClass("is-small-pb");
    let e = 768 > $(window).width() ? 4 : 10;
    $(".w-page-count").each(function () {
    	let t = $(this).closest(".w-pagination-wrapper").find('[class*="w-pagination"]').first().prop("href").split("=")[0],
    		s = parseInt(/[^/]*$/.exec($(this).text())[0].trim()),
    		a = parseInt($(this).text().split("/")[0].trim()),
    		i = Math.max(1, Math.min(e || s, s)),
    		o = Math.min(Math.max(1, a - Math.ceil((i - 1) / 2)) + (i - 1), s),
    		r = o - (i - 1);
    	$(this).empty();
    	for (let l = r; l <= o; l++) {
    		let n = l,
    			c = t + "=" + n,
    			p = n == a,
    			u = $("<a>", { class: [p && "is-current", "page-link"].filter((e) => e).join(" "), href: c, text: n });
    		$(this).append(u);
    	}
    }),
    	$(".article-content-area p").each(function () {
    		$(this).html().indexOf("{separator}") + 1 && $(this).html("").addClass("separator");
    	}),
    	$(".article-content-area h2").each(function (e) {
    		let t = $(".article-toc-list"),
    			s = 97 + e,
    			a = $(this).html();
    		a.indexOf(". ") + 1 && (a = a.split(". ")[1]), $(this).attr("id", String.fromCharCode(s)), t.append('<li class="article-toc-item"><a href="#' + String.fromCharCode(s) + '" class="article-toc-link">' + a + "</a></li>");
    	});
}),
	addInputPhoneMask();
var forms = document.querySelectorAll("form");
forms.length &&
	forms.forEach((e) => {
		checkValidationFormOnSubmit(`#${e.getAttribute("id")}`), e.setAttribute("novalidate", "");
	}),
	$(".blog-category-list").length && $(".blog-category-list").prepend('<div role="listitem" class="w-dyn-item"><a href="/blog" aria-current="page" class="blog-category-link w--current">All Articles</a></div>');
const nav = $(".navbar");
function openDropdown(e) {
    let t = e.find(".dropdown-content-wrapper");
    t.css({ height: t.find("div").innerHeight(), opacity: 1 }), e.addClass("is--open");
}
function closeDropdown(e) {
    e.find(".dropdown-content-wrapper").css({ height: 0, opacity: 0 }), e.removeClass("is--open");
}
window.addEventListener("scroll", function (e) {
    let t = e.target.scrollingElement.scrollTop;
    t > 10 ? nav.hasClass("is-fixed") || nav.addClass("is-fixed") : nav.hasClass("is-fixed") && nav.removeClass("is-fixed");
}),
	$(".reviews-collection-grid").masonry({ itemSelector: ".reviews-collection-item" }),
	window.addEventListener("DOMContentLoaded", function () {
		openDropdown($(".dropdown").eq(0)),
			$(".article-content-area").length &&
				$(".article-content-area").each(function () {
					openDropdown($(this).find(".dropdown").eq(0));
				});
	}),
	$("body").on("click", ".dropdown-toggle", function () {
		let e = $(this).parent(".dropdown");
		e.hasClass("is--open") ? closeDropdown(e) : openDropdown(e), closeDropdown(e.siblings(".is--open"));
	});
var d = new Date(),
	strDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
function formatRepo(e) {
    return e.loading ? e.text : "<div class='select2-result-repository clearfix'><div class='select2-result-title'>" + e.text + "</div>";
}
function formatRepoSelection(e) {
    return e.text;
}
$(".is-date").datepicker({ zIndex: 1e3, autoHide: !0, startDate: strDate, format: "yyyy-mm-dd" }),
	$(".is-date").on("pick.datepicker", function () {
		$(this).removeClass("is-error");
	}),
	$(".is-select").select2({ minimumResultsForSearch: -1, dropdownCssClass: "select-dropdown" }),
	$(".is-select").on("select2:selecting", function (e) {
		$(this).removeClass("is-error");
	}),
	$.fn.select2.amd.define("select2/data/googleAutocompleteAdapter", ["select2/data/array", "select2/utils"], function (e, t) {
		function s(e, t) {
			s.__super__.constructor.call(this, e, t);
		}
		return (
			t.Extend(s, e),
			(s.prototype.query = function (e, t) {
				var s = function (e, s) {
					var a = { results: [] };
					if ((s != google.maps.places.PlacesServiceStatus.OK && t(a), e.length)) for (var i = 0; i < e.length; i++) a.results.push({ id: e[i].place_id.toString(), text: e[i].description.toString() });
					a.results.push({ id: " ", text: "Powered by Google", disabled: !0 }), t(a);
				};
				if (e.term && "" != e.term) new google.maps.places.AutocompleteService().getPlacePredictions({ input: e.term }, s);
				else {
					var a = { results: [] };
					a.results.push({ id: " ", text: "Powered by Google", disabled: !0 }), t(a);
				}
			}),
			s
		);
	});
var googleAutocompleteAdapter = $.fn.select2.amd.require("select2/data/googleAutocompleteAdapter"),
	$select = $(".is-address-autocomplate");
function getDetails(e, t) {
    new google.maps.Geocoder().geocode({ placeId: e }, function (e, s) {
    	if ("OK" === s) {
    		if (e[0]) {
    			let a = extractComponents(e[0]);
    			switch (t.getAttribute("name")) {
    				case "thoroughfare_from":
    					document.querySelector('[name="moving_from_zip"]').value = a.postal_code ? a.postal_code : "00000";
    					break;
    				case "thoroughfare_to":
    					document.querySelector('[name="moving_to_zip"]').value = a.postal_code ? a.postal_code : "00000";
    			}
    			$(t).find("option:selected").val(a.formatted_address);
    		} else window.alert("No results found");
    	} else window.alert("Geocoder failed due to: " + s);
    });
}
function extractComponents(e) {
    for (
    	var t = { street_number: "short_name", route: "long_name", locality: "long_name", administrative_area_level_1: "short_name", country: "long_name", postal_code: "short_name" },
    		s = { google_place_id: e.place_id, formatted_address: e.formatted_address, city: "", state: "", country: "", postal_code: "", lat: e.geometry.location.lat(), lng: e.geometry.location.lng() },
    		a = 0;
    	a < e.address_components.length;
    	a++
    ) {
    	var i = e.address_components[a].types[0];
    	if (t[i]) {
    		var o = e.address_components[a][t[i]];
    		"locality" === i ? (s.city = o) : "administrative_area_level_1" === i ? (s.state = o) : "country" === i ? (s.country = o) : "postal_code" === i && (s.postal_code = o);
    	}
    }
    return s;
}
function formToObj(e) {
    var t = e.serializeArray(),
    	s = {};
    return (
    	$.each(t, function () {
    		s[this.name] = this.value || null;
    	}),
    	s
    );
}
$select.each(function () {
    $(this).select2({
    	width: "100%",
    	dataAdapter: googleAutocompleteAdapter,
    	placeholder: $(this).attr("select2-placeholder"),
    	escapeMarkup: function (e) {
    		return e;
    	},
    	minimumInputLength: 2,
    	templateResult: formatRepo,
    	templateSelection: formatRepoSelection,
    }),
    	$(this).on("select2:select", function (e) {
    		getDetails($(e.currentTarget).find("option:selected").val(), e.currentTarget);
    	});
}),
	$("form").length &&
		($("form").each(function () {
			$(this).hasClass("referer-form") || ($(this).attr("data-api-redirect", $(this).attr("redirect")), $(this).removeAttr("redirect data-redirect")),
				$(".services-hero-h1").length
					? ($(this).attr("data-name", "Form in " + $(".services-hero-h1").html() + " Page."), $(this).attr("name", "Form in " + $(".services-hero-h1").html() + " Page."))
					: ($(this).attr("data-name", "Form in " + $("title").text() + "."), $(this).attr("name", "Form in " + $("title").text() + "."));
		}),
		$(".bottom-cta-wrapper form").length &&
			($(".services-hero-section form").length ? $(".bottom-cta-wrapper form").attr("redirect", $(".services-hero-section form").attr("redirect")) : $(".bottom-cta-wrapper form").attr("redirect", "/confirmation-page"))),

    // --- НАЧАЛО: ИЗМЕНЕННАЯ ЛОГИКА ОТПРАВКИ ФОРМЫ ---
	$("form").on("submit", function () {
		var e = $(this),
			// 1. Убираем лишнюю обертку { data: ... }
			t = formToObj(e),
			s = e.attr("data-api-redirect"),
			a = e.find('[type="submit"]'),
			i = a.val();

		if (!formValidation(e[0])) return !1; // Валидация снова блокирует отправку, если поля неверны

		if (!e.hasClass("referer-form")) {
			// 2. Добавляем заглушки и обязательные поля прямо в "плоский" объект
			t.field_last_name = t.field_last_name || "Not Provided";
            t.field_first_name = t.field_first_name || "Not Provided";
            t.field_e_mail = t.field_e_mail || "no-reply@example.com";
            t.field_phone = t.field_phone || "(000) 000-0000";
			t.provider_id = 50;
			
            if (!t.moving_from_zip) {
				var o = new Date,
					r = o.getFullYear() + "-" + ("0" + (o.getMonth() + 1)).slice(-2) + "-" + ("0" + o.getDate()).slice(-2);
				t.moving_from_zip = "00000";
				t.moving_to_zip = "00000";
				t.field_move_service_type = 0;
				t.field_date = r;
			}

			a.val(a.data("wait"));
			var dataToSend = JSON.stringify(t);
			console.log("Отправляемые данные (плоская структура):", dataToSend);
			var l = $(this).siblings(".w-form-fail");

			$.ajax({
				url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
				type: "POST",
				dataType: "text",
				data: dataToSend,
				contentType: "application/json",
				statusCode: {
					400: function (xhr) {
                        var errorMsg = "Bad Request";
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if (response && response.status_message) {
                                errorMsg = response.status_message;
                            }
                        } catch (err) {}
						l.html(errorMsg), l.show(), a.val(i);
					}
				},
				success: function (response) {
					var parsedResponse = JSON.parse(response);
					parsedResponse.status ? (window.location = s) : (l.html(parsedResponse.status_message), l.show()), a.val(i);
				},
				error: function (xhr, status, error) {
                    // Игнорируем ошибку 400, так как она обрабатывается в statusCode
                    if (xhr.status === 400) return; 
					l.html("Network error, please try again."), l.show(), a.val(i);
				},
			});
		}
	});
    // --- КОНЕЦ: ИЗМЕНЕННАЯ ЛОГИКА ОТПРАВКИ ФОРМЫ ---
