// ========================================================================
// НАЧАЛО ОТФОРМАТИРОВАННОГО КОДА С ВНЕСЕННЫМИ ИЗМЕНЕНИЯМИ
// ========================================================================

const Webflow = window.Webflow || [];

function addInputPhoneMask() {
    let inputs = document.querySelectorAll("input.is-phone"),
        nonDigits = /\D/g,
        getDigits = e => e.value.replace(nonDigits, ""),
        onInput = e => {
            let input = e.target,
                digits = getDigits(input),
                formatted = "",
                { selectionEnd, selectionStart } = input;

            if (!digits) {
                input.value = "";
                return;
            }

            if (input.value.length !== selectionStart && e.data && nonDigits.test(e.data)) {
                input.value = digits;
            }

            if (digits.length > 0) formatted += `(${digits.substring(0, 3)}`;
            if (digits.length >= 4) formatted += `) ${digits.substring(3, 6)}`;
            if (digits.length >= 7) formatted += `-${digits.substring(6, 8)}`;
            if (digits.length >= 9) formatted += `${digits.substring(8, 10)}`;
            if (digits.length >= 11) formatted = `${digits.substring(0, 16)}`;

            if (digits.length === 10) input.classList.add("valid");
            else input.classList.remove("valid");

            let caret = getNewCaretPosition(digits, formatted);
            input.value = formatted;
            input.setSelectionRange(caret, caret);
        },
        onKeyDown = e => {
            let input = e.target,
                digits = input.value.replace(/\D/g, "");
            if (e.keyCode === 8 && digits.length === 1) input.value = "";
        },
        onPaste = e => {
            let input = e.target,
                digits = getDigits(input),
                clipboard = e.clipboardData || window.Clipboard;
            if (clipboard) {
                let pasted = clipboard.getData("Text");
                if (nonDigits.test(pasted)) input.value = digits;
            }
        },
        onFocus = e => {
            let input = e.target;
            if (!input.classList.contains("focus")) {
                setTimeout(() => {
                    input.selectionStart = input.value.length;
                }, 100);
            }
            input.classList.add("focus");
        },
        onFocusOut = e => {
            let input = e.target;
            input.classList.remove("focus");
        },
        onBeforeInput = e => {
            selectedNumberCount = Math.abs(
                e.target.value
                .slice(e.target.selectionStart, e.target.selectionEnd)
                .replaceAll(/\s/g, "").length
            );
            prevRawNumber = e.target.value.replaceAll(/\D/g, "");
            prevNumberCaretPosition = e.target.value
                .slice(0, e.target.selectionStart)
                .replaceAll(/\D/g, "").length;
        };

    inputs.forEach(input => {
        input.addEventListener("input", onInput, false);
        input.addEventListener("keydown", onKeyDown);
        input.addEventListener("paste", onPaste, false);
        input.addEventListener("focus", onFocus, false);
        input.addEventListener("focusout", onFocusOut, false);
        input.addEventListener("beforeinput", onBeforeInput, false);
    });
}

function getNewCaretPosition(raw, formatted) {
    let chars = formatted.split(""),
        count = 0,
        caret = prevNumberCaretPosition + (raw.length - prevRawNumber.length + selectedNumberCount),
        i;
    for (i = 0; i <= chars.length - 1 && count !== caret; i++) {
        if (/\d/.test(chars[i])) ++count;
    }
    return i;
}

function removeErrorClassOnInput(input) {
    input.addEventListener("input", () => {
        input.classList.remove("is-error");
    });
    if (input.type === "radio") {
        input.addEventListener("click", () => {
            document.querySelectorAll(`[name=${input.dataset.name}]`).forEach(el => {
                el.classList.remove("is-error");
            });
        });
    }
    input.addEventListener("focus", () => {});
}

function formValidation(form) {
    let valid = true,
        fields = form.querySelectorAll('input, select, [type="radio"]');
    fields.forEach(input => {
        let { value, dataset } = input;
        input.classList.remove("is-error");
        if (input.classList.contains("is-phone") && !input.classList.contains("valid")) {
            input.classList.add("is-error");
            valid = false;
        }
        if (dataset.required === "true") {
            if (!value) {
                input.classList.add("is-error");
                valid = false;
            }
            if (
                input.type === "radio" &&
                !document.querySelector(`[name=${input.dataset.name}]:checked`)
            ) {
                document.querySelectorAll(`[name=${input.dataset.name}]`).forEach(el => {
                    el.classList.add("is-error");
                });
                selectToggle && selectToggle.classList.add("is-error");
            }
        }
    });
    return valid;
}

function checkValidationFormOnSubmit(selector) {
    let form = document.querySelector(selector),
        fields = form.querySelectorAll('input, select, [type="radio"]'),
        onSubmit = e => !!formValidation(form);
    fields.forEach(input => {
        let required = input.getAttribute("data-required");
        if (required) removeErrorClassOnInput(input);
    });
    $(selector).submit(onSubmit);
}

Webflow.push(function() {
    // ... ваш код для слайдеров и прочего остается без изменений ...
});

addInputPhoneMask();

var forms = document.querySelectorAll("form");
if (forms.length) {
    forms.forEach(form => {
        checkValidationFormOnSubmit(`#${form.getAttribute("id")}`);
        form.setAttribute("novalidate", "");
    });
}

$(".blog-category-list").length &&
    $(".blog-category-list").prepend(
        '<div role="listitem" class="w-dyn-item"><a href="/blog" aria-current="page" class="blog-category-link w--current">All Articles</a></div>'
    );

const nav = $(".navbar");

function openDropdown(dropdown) {
    let content = dropdown.find(".dropdown-content-wrapper");
    content.css({
        height: content.find("div").innerHeight(),
        opacity: 1
    });
    dropdown.addClass("is--open");
}

function closeDropdown(dropdown) {
    dropdown.find(".dropdown-content-wrapper").css({
        height: 0,
        opacity: 0
    });
    dropdown.removeClass("is--open");
}

window.addEventListener("scroll", function(e) {
    let scrollTop = e.target.scrollingElement.scrollTop;
    if (scrollTop > 10) {
        if (!nav.hasClass("is-fixed")) nav.addClass("is-fixed");
    } else {
        if (nav.hasClass("is-fixed")) nav.removeClass("is-fixed");
    }
});

$(".reviews-collection-grid").masonry({
    itemSelector: ".reviews-collection-item"
});

window.addEventListener("DOMContentLoaded", function() {
    openDropdown($(".dropdown").eq(0));
    $(".article-content-area").length &&
        $(".article-content-area").each(function() {
            openDropdown($(this).find(".dropdown").eq(0));
        });
});

$("body").on("click", ".dropdown-toggle", function() {
    let dropdown = $(this).parent(".dropdown");
    if (dropdown.hasClass("is--open")) closeDropdown(dropdown);
    else openDropdown(dropdown);
    closeDropdown(dropdown.siblings(".is--open"));
});

var d = new Date(),
    strDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

function formatRepo(repo) {
    return repo.loading ?
        repo.text :
        "<div class='select2-result-repository clearfix'><div class='select2-result-title'>" +
        repo.text +
        "</div>";
}

function formatRepoSelection(repo) {
    return repo.text;
}

$(".is-date").datepicker({
    zIndex: 1e3,
    autoHide: true,
    startDate: strDate,
    format: "yyyy-mm-dd"
});
$(".is-date").on("pick.datepicker", function() {
    $(this).removeClass("is-error");
});
$(".is-select").select2({
    minimumResultsForSearch: -1,
    dropdownCssClass: "select-dropdown"
});
$(".is-select").on("select2:selecting", function(e) {
    $(this).removeClass("is-error");
});

$.fn.select2.amd.define("select2/data/googleAutocompleteAdapter", ["select2/data/array", "select2/utils"], function(ArrayAdapter, Utils) {
    function GoogleAdapter() {
        GoogleAdapter.__super__.constructor.call(this, ...arguments);
    }
    Utils.Extend(GoogleAdapter, ArrayAdapter);
    GoogleAdapter.prototype.query = function(params, callback) {
        var process = function(results, status) {
            var data = { results: [] };
            if (status != google.maps.places.PlacesServiceStatus.OK && callback(data));
            if (results.length)
                for (var i = 0; i < results.length; i++)
                    data.results.push({
                        id: results[i].place_id.toString(),
                        text: results[i].description.toString()
                    });
            data.results.push({
                id: " ",
                text: "Powered by Google",
                disabled: true
            });
            callback(data);
        };
        if (params.term && params.term !== "") {
            new google.maps.places.AutocompleteService().getPlacePredictions({
                    input: params.term
                },
                process
            );
        } else {
            var data = { results: [] };
            data.results.push({
                id: " ",
                text: "Powered by Google",
                disabled: true
            });
            callback(data);
        }
    };
    return GoogleAdapter;
});

var googleAutocompleteAdapter = $.fn.select2.amd.require("select2/data/googleAutocompleteAdapter"),
    $select = $(".is-address-autocomplate");

function getDetails(placeId, select) {
    new google.maps.Geocoder().geocode({ placeId: placeId }, function(results, status) {
        if (status === "OK") {
            if (results[0]) {
                let components = extractComponents(results[0]);
                switch (select.getAttribute("name")) {
                    case "thoroughfare_from":
                        document.querySelector('[name="moving_from_zip"]').value =
                            components.postal_code ? components.postal_code : "00000";
                        break;
                    case "thoroughfare_to":
                        document.querySelector('[name="moving_to_zip"]').value =
                            components.postal_code ? components.postal_code : "00000";
                }
                $(select).find("option:selected").val(components.formatted_address);
            } else window.alert("No results found");
        } else window.alert("Geocoder failed due to: " + status);
    });
}

function extractComponents(place) {
    var mapping = {
            street_number: "short_name",
            route: "long_name",
            locality: "long_name",
            administrative_area_level_1: "short_name",
            country: "long_name",
            postal_code: "short_name"
        },
        result = {
            google_place_id: place.place_id,
            formatted_address: place.formatted_address,
            city: "",
            state: "",
            country: "",
            postal_code: "",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    for (var i = 0; i < place.address_components.length; i++) {
        var type = place.address_components[i].types[0];
        if (mapping[type]) {
            var value = place.address_components[i][mapping[type]];
            if (type === "locality") result.city = value;
            else if (type === "administrative_area_level_1") result.state = value;
            else if (type === "country") result.country = value;
            else if (type === "postal_code") result.postal_code = value;
        }
    }
    return result;
}

function formToObj($form) {
    var arr = $form.serializeArray(),
        obj = {};
    $.each(arr, function() {
        obj[this.name] = this.value || null;
    });
    return obj;
}

$select.each(function() {
    $(this).select2({
        width: "100%",
        dataAdapter: googleAutocompleteAdapter,
        placeholder: $(this).attr("select2-placeholder"),
        escapeMarkup: function(m) {
            return m;
        },
        minimumInputLength: 2,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });
    $(this).on("select2:select", function(e) {
        getDetails($(e.currentTarget).find("option:selected").val(), e.currentTarget);
    });
});

$("form").length &&
    ($("form").each(function() {
        if (!$(this).hasClass("referer-form")) {
            $(this).attr("data-api-redirect", $(this).attr("redirect"));
            $(this).removeAttr("redirect data-redirect");
        }
        if ($(".services-hero-h1").length) {
            $(this).attr(
                "data-name",
                "Form in " + $(".services-hero-h1").html() + " Page."
            );
            $(this).attr(
                "name",
                "Form in " + $(".services-hero-h1").html() + " Page."
            );
        } else {
            $(this).attr("data-name", "Form in " + $("title").text() + ".");
            $(this).attr("name", "Form in " + $("title").text() + ".");
        }
    }),
    $(".bottom-cta-wrapper form").length &&
    ($(".services-hero-section form").length ?
        $(".bottom-cta-wrapper form").attr(
            "redirect",
            $(".services-hero-section form").attr("redirect")
        ) :
        $(".bottom-cta-wrapper form").attr("redirect", "/confirmation-page")));

$("form").on("submit", function() {
    var $form = $(this),
        data = { data: formToObj($form) },
        redirect = $form.attr("data-api-redirect"),
        $submit = $form.find('[type="submit"]'),
        submitVal = $submit.val();

    // --- ИЗМЕНЕНИЕ №1: ВАЛИДАЦИЯ ОТКЛЮЧЕНА ---
    // Строка ниже закомментирована, чтобы отключить проверку полей.
    // if (!formValidation($form[0])) return false;

    if (!$form.hasClass("referer-form")) {
        $submit.val($submit.data("wait"));
        data.data.field_last_name = "n/a";
        data.data.provider_id = 50;

        // --- ИЗМЕНЕНИЕ №2: ДОБАВЛЕНЫ ЗАГЛУШКИ ДЛЯ ПУСТЫХ ПОЛЕЙ ---
        if (!data.data.field_first_name) {
            data.data.field_first_name = "n/a";
        }
        if (!data.data.field_phone) {
            data.data.field_phone = "n/a";
        }
        if (!data.data.field_e_mail) {
            data.data.field_e_mail = "n/a";
        }
        // --- КОНЕЦ ИЗМЕНЕНИЯ №2 ---

        if (!data.data.moving_from_zip) {
            var now = new Date(),
                today =
                now.getFullYear() +
                "-" +
                ("0" + (now.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + now.getDate()).slice(-2);
            data.data.moving_from_zip = "00000";
            data.data.moving_to_zip = "00000";
            data.data.field_move_service_type = 0;
            data.data.field_date = today;
        }

        data = JSON.stringify(data);
        console.log(data);

        var $fail = $form.siblings(".w-form-fail");
        $.ajax({
            url: "https://api.sosmovingla.net/server/parser/get_lead_parsing",
            type: "POST",
            dataType: "text",
            data: data,
            contentType: "application/json",
            statusCode: {
                400: function(xhr) {
                    var res = JSON.parse(xhr);
                    $fail.html(res.status_message);
                    $fail.show();
                    $submit.val(submitVal);
                }
            },
            success: function(res) {
                var json = JSON.parse(res);
                if (json.status) window.location = redirect;
                else {
                    $fail.html(json.status_message);
                    $fail.show();
                }
                $submit.val(submitVal);
            },
            error: function(xhr, status, error) {
                $fail.html(status.status_message);
                $fail.show();
                $submit.val(submitVal);
            }
        });
    }
});


// --- ИЗМЕНЕНИЕ №3: НОВЫЙ БЛОК ДЛЯ ОТСЛЕЖИВАНИЯ ИСТОЧНИКА ПЕРЕХОДА ---
document.addEventListener('DOMContentLoaded', function() {
    // Ищем на странице скрытое поле с ID #referral-source
    const referralInput = document.getElementById('referral-source');

    // Если такого поля нет, ничего не делаем
    if (!referralInput) {
        return;
    }

    let source = 'Direct/Unknown'; // Значение по умолчанию

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const gclid = urlParams.get('gclid');

        if (utmSource) {
            // Если есть UTM-метка, используем её (самый надежный способ)
            source = utmSource;
        } else if (gclid) {
            source = 'Google Ads';
        } else if (document.referrer) {
            // Если нет UTM, но есть HTTP-реферер, используем его
            const referrerHost = new URL(document.referrer).hostname;
            if (referrerHost.includes('google')) {
                source = 'Google search';
            } else if (referrerHost.includes('bing')) {
                source = 'Bing';
            } else if (referrerHost.includes('facebook') || referrerHost.includes('instagram')) {
                source = 'Facebook/Instagram';
            } else if (referrerHost.includes('yelp')) {
                source = 'Yelp';
            } else {
                 source = referrerHost; // Если источник не из списка, записываем хост
            }
        }
    } catch (error) {
        console.error('Error getting referral source:', error);
        if (document.referrer) {
            source = document.referrer;
        }
    }

    // Устанавливаем значение в скрытое поле
    referralInput.value = source;
});
// --- КОНЕЦ ИЗМЕНЕНИЯ №3 ---
