var EaseProHost = {};
EaseProHost.__ready = true;
EaseProHost.__version = "3.0.6";
var EaseProCopied = null;

function EPClamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

function EPAddTarget(list, property) {
    var i;
    if (!property) return;
    try {
        if (property.propertyType != PropertyType.PROPERTY) return;
        if (!property.canVaryOverTime) return;
        if (!property.selectedKeys || property.selectedKeys.length < 1) return;
        for (i = 0; i < list.length; i++) if (list[i] === property) return;
        list.push(property);
    } catch (ignore) {}
}

function EPWalk(group, list) {
    var i;
    var property;
    try {
        for (i = 1; i <= group.numProperties; i++) {
            property = group.property(i);
            if (property.propertyType == PropertyType.PROPERTY) EPAddTarget(list, property);
            else EPWalk(property, list);
        }
    } catch (ignore) {}
}

function EPTargets() {
    var list = [];
    var comp = app.project ? app.project.activeItem : null;
    var properties;
    var layers;
    var i;
    if (!comp || !(comp instanceof CompItem)) return list;
    properties = comp.selectedProperties;
    for (i = 0; i < properties.length; i++) EPAddTarget(list, properties[i]);
    if (list.length > 0) return list;
    layers = comp.selectedLayers;
    for (i = 0; i < layers.length; i++) EPWalk(layers[i], list);
    return list;
}

function EPRates(property, firstKey, secondKey, count) {
    var firstValue = property.keyValue(firstKey);
    var secondValue = property.keyValue(secondKey);
    var duration = Math.abs(property.keyTime(secondKey) - property.keyTime(firstKey));
    var rates = [];
    var i;
    var total;
    if (duration < 0.000001) duration = 0.000001;
    if (count == 1) {
        if (firstValue instanceof Array && secondValue instanceof Array) {
            total = 0;
            for (i = 0; i < firstValue.length && i < secondValue.length; i++) total += Math.pow(Number(secondValue[i]) - Number(firstValue[i]), 2);
            rates[0] = Math.sqrt(total) / duration;
        } else {
            rates[0] = (Number(secondValue) - Number(firstValue)) / duration;
        }
    } else {
        for (i = 0; i < count; i++) rates[i] = (Number(secondValue[i]) - Number(firstValue[i])) / duration;
    }
    return rates;
}

function EPEases(count, rates, slope, influence) {
    var result = [];
    var i;
    var speed;
    for (i = 0; i < count; i++) {
        speed = Number(rates[Math.min(i, rates.length - 1)]) * slope;
        if (!isFinite(speed)) speed = 0;
        result.push(new KeyframeEase(EPClamp(speed, -10000000, 10000000), EPClamp(influence, 0.1, 100)));
    }
    return result;
}

EaseProHost.applyCurve = function (x1, y1, x2, y2, part) {
    var list = EPTargets();
    var changed = 0;
    var skipped = 0;
    var lastError = "";
    var p;
    var j;
    var property;
    var keys;
    var key;
    var oldIn;
    var oldOut;
    var oldInType;
    var oldOutType;
    var newIn;
    var newOut;
    var doIn;
    var doOut;
    if (list.length < 1) return "ERR|Selectionne au moins une image cle avec une voisine.";
    x1 = EPClamp(Number(x1), 0.001, 0.999);
    x2 = EPClamp(Number(x2), 0.001, 0.999);
    y1 = Number(y1);
    y2 = Number(y2);
    if (isNaN(y1) || isNaN(y2)) return "ERR|Coordonnees de courbe invalides.";
    if (!part) part = "both";
    app.beginUndoGroup("Ease Pro - Appliquer");
    try {
        for (p = 0; p < list.length; p++) {
            property = list[p];
            keys = property.selectedKeys;
            for (j = 0; j < keys.length; j++) {
                key = keys[j];
                try {
                    oldIn = property.keyInTemporalEase(key);
                    oldOut = property.keyOutTemporalEase(key);
                    doIn = part != "out" && key > 1;
                    doOut = part != "in" && key < property.numKeys;
                    if (!doIn && !doOut) { skipped++; continue; }
                    oldInType = property.keyInInterpolationType(key);
                    oldOutType = property.keyOutInterpolationType(key);
                    newIn = oldIn;
                    newOut = oldOut;
                    if (doIn) newIn = EPEases(oldIn.length, EPRates(property, key - 1, key, oldIn.length), (1 - y2) / (1 - x2), (1 - x2) * 100);
                    if (doOut) newOut = EPEases(oldOut.length, EPRates(property, key, key + 1, oldOut.length), y1 / x1, x1 * 100);
                    property.setInterpolationTypeAtKey(key, doIn ? KeyframeInterpolationType.BEZIER : oldInType, doOut ? KeyframeInterpolationType.BEZIER : oldOutType);
                    try { property.setTemporalAutoBezierAtKey(key, false); } catch (ignoreAuto) {}
                    try { property.setTemporalContinuousAtKey(key, false); } catch (ignoreContinuous) {}
                    property.setTemporalEaseAtKey(key, newIn, newOut);
                    changed++;
                } catch (oneError) {
                    skipped++;
                    lastError = oneError.toString();
                }
            }
        }
    } catch (error) {
        lastError = error.toString();
    }
    app.endUndoGroup();
    if (changed < 1) return "ERR|Aucune image cle compatible modifiee" + (lastError ? " : " + lastError : "") + ".";
    return "OK|" + changed + " image(s) cle(s) modifiee(s)" + (skipped ? " - " + skipped + " ignoree(s)" : "") + ".";
};

EaseProHost.setMode = function (mode) {
    var list = EPTargets();
    var changed = 0;
    var p;
    var j;
    var property;
    var keys;
    var key;
    if (list.length < 1) return "ERR|Selectionne les images cles a modifier.";
    app.beginUndoGroup("Ease Pro - Mode");
    try {
        for (p = 0; p < list.length; p++) {
            property = list[p];
            keys = property.selectedKeys;
            for (j = 0; j < keys.length; j++) {
                key = keys[j];
                if (mode == "hold") property.setInterpolationTypeAtKey(key, KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
                else if (mode == "linear") property.setInterpolationTypeAtKey(key, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
                else property.setInterpolationTypeAtKey(key, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                changed++;
            }
        }
    } catch (error) {
        app.endUndoGroup();
        return "ERR|Commande impossible : " + error.toString();
    }
    app.endUndoGroup();
    return "OK|" + changed + " image(s) cle(s) modifiee(s).";
};

EaseProHost.copyEase = function () {
    var list = EPTargets();
    var property;
    var key;
    if (list.length < 1) return "ERR|Selectionne une image cle a copier.";
    property = list[0];
    key = property.selectedKeys[0];
    EaseProCopied = { incoming: property.keyInTemporalEase(key), outgoing: property.keyOutTemporalEase(key), inType: property.keyInInterpolationType(key), outType: property.keyOutInterpolationType(key) };
    return "OK|Easing copie.";
};

EaseProHost.pasteEase = function () {
    var list = EPTargets();
    var p;
    var j;
    var property;
    var keys;
    var key;
    if (!EaseProCopied) return "ERR|Copie d'abord un easing.";
    if (list.length < 1) return "ERR|Selectionne les destinations.";
    app.beginUndoGroup("Ease Pro - Coller");
    try {
        for (p = 0; p < list.length; p++) {
            property = list[p];
            keys = property.selectedKeys;
            for (j = 0; j < keys.length; j++) {
                key = keys[j];
                property.setInterpolationTypeAtKey(key, EaseProCopied.inType, EaseProCopied.outType);
                property.setTemporalEaseAtKey(key, EaseProCopied.incoming, EaseProCopied.outgoing);
            }
        }
    } catch (error) {
        app.endUndoGroup();
        return "ERR|Collage impossible : " + error.toString();
    }
    app.endUndoGroup();
    return "OK|Easing colle.";
};

EaseProHost.createBounce = function () {
    return "ERR|Le preset Bounce necessite deux images cles selectionnees.";
};
