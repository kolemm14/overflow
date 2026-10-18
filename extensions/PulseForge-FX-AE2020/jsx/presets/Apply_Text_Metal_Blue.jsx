#target aftereffects

(function () {
    var SCRIPT_NAME = "Text Metal Blue";
    var silent = ($.global.FXPRO_TEXT_METAL_SILENT === true);

    var variants = {
        "DEFAULT": {brightness:5, contrast:32, top:72, blue:88, cyan:68, stroke:2.5, strokeBright:88, bevel:2, highlight:34, glow:0.35, glowRadius:5, shadow:32},
        "DARK": {brightness:-12, contrast:48, top:92, blue:62, cyan:42, stroke:2.8, strokeBright:68, bevel:2.5, highlight:22, glow:0.20, glowRadius:4, shadow:48},
        "BRIGHT": {brightness:16, contrast:24, top:48, blue:96, cyan:92, stroke:2.4, strokeBright:100, bevel:1.5, highlight:48, glow:0.42, glowRadius:6, shadow:24},
        "AMV": {brightness:4, contrast:58, top:82, blue:100, cyan:86, stroke:3.0, strokeBright:96, bevel:2.5, highlight:42, glow:0.55, glowRadius:7, shadow:46},
        "SILVER BLUE": {brightness:10, contrast:30, top:58, blue:48, cyan:28, stroke:2.5, strokeBright:96, bevel:2, highlight:46, glow:0.18, glowRadius:4, shadow:30}
    };

    function fail(message) {
        if (!silent) alert(message, SCRIPT_NAME);
        return "ERR|" + message;
    }
    function color(hex) {
        return [parseInt(hex.substr(1,2),16)/255, parseInt(hex.substr(3,2),16)/255, parseInt(hex.substr(5,2),16)/255];
    }
    function esc(value) { return String(value).replace(/\\/g,"\\\\").replace(/\"/g,"\\\""); }
    function effects(layer) { return layer.property("ADBE Effect Parade"); }
    function addEffect(layer, ids, name) {
        var parade = effects(layer), fx = null;
        if (!parade) return null;
        for (var i=0; i<ids.length; i++) {
            try { if (parade.canAddProperty(ids[i])) { fx = parade.addProperty(ids[i]); break; } } catch (_) {}
        }
        if (fx && name) fx.name = name;
        return fx;
    }
    function clearEffects(layer) {
        var p = effects(layer);
        if (!p) return;
        while (p.numProperties > 0) p.property(p.numProperties).remove();
    }
    function setValue(prop, value) { try { if (prop) prop.setValue(value); } catch (_) {} }
    function setIndex(fx, index, value) { try { setValue(fx.property(index), value); } catch (_) {} }
    function setExpression(prop, expression) {
        try { if (prop && prop.canSetExpression) { prop.expression = expression; prop.expressionEnabled = true; } } catch (_) {}
    }
    function addSlider(layer, name, value) {
        var fx = addEffect(layer, ["ADBE Slider Control"], name);
        if (fx) setIndex(fx, 1, value);
        return fx;
    }
    function addFill(layer, name, value) {
        var fx = addEffect(layer, ["ADBE Fill"], name);
        if (fx) {
            var done = false;
            try { var p = fx.property("Color"); if (p) { p.setValue(value); done = true; } } catch (_) {}
            if (!done) setIndex(fx, 3, value);
        }
        return fx;
    }
    function addRectMask(layer, name, startPct, endPct, featherPct, controllerName) {
        var masks = layer.property("ADBE Mask Parade");
        var mask = masks.addProperty("ADBE Mask Atom");
        mask.name = name;
        var shape = mask.property("ADBE Mask Shape");
        var expr = "var r=sourceRectAtTime(time,false);" +
            "var c=thisComp.layer(\"" + esc(controllerName) + "\").effect(\"Metal Center\")(1)/100;" +
            "var shift=(c-.5)*r.height;" +
            "var y0=r.top+r.height*" + startPct + "+shift;" +
            "var y1=r.top+r.height*" + endPct + "+shift;" +
            "createPath([[r.left-20,y0],[r.left+r.width+20,y0],[r.left+r.width+20,y1],[r.left-20,y1]],[],[],true);";
        setExpression(shape, expr);
        var feather = mask.property("ADBE Mask Feather");
        setExpression(feather, "var r=sourceRectAtTime(time,false);[0,Math.max(2,r.height*" + featherPct + ")]");
        return mask;
    }
    function duplicatePass(base, name, controllerName, fillColor, startPct, endPct, featherPct, opacityExpression) {
        var layer = base.duplicate();
        layer.name = name;
        clearEffects(layer);
        var source = layer.property("ADBE Text Properties").property("ADBE Text Document");
        setExpression(source, "thisComp.layer(\"" + esc(base.name) + "\").text.sourceText");
        addFill(layer, "MB Fill", fillColor);
        addRectMask(layer, "MB Gradient Band", startPct, endPct, featherPct, controllerName);
        if (opacityExpression) setExpression(layer.property("ADBE Transform Group").property("ADBE Opacity"), opacityExpression);
        layer.moveAfter(base);
        return layer;
    }
    function chooseVariant() {
        var requested = $.global.FXPRO_TEXT_METAL_VARIANT;
        if (requested && variants[String(requested).toUpperCase()]) return String(requested).toUpperCase();
        var w = new Window("dialog", "Text Metal Blue — AE 2020");
        w.orientation = "column"; w.alignChildren = "fill";
        w.add("statictext", undefined, "Choisissez une variante :");
        var d = w.add("dropdownlist", undefined, ["DEFAULT","DARK","BRIGHT","AMV","SILVER BLUE"]);
        d.selection = 0;
        var g = w.add("group"); g.alignment = "right";
        g.add("button", undefined, "Annuler", {name:"cancel"});
        g.add("button", undefined, "Appliquer", {name:"ok"});
        if (w.show() !== 1) return null;
        return d.selection.text;
    }
    function fontAvailable(postScriptName) {
        try {
            var probe = new TextDocument("TEXT");
            probe.font = postScriptName;
            return String(probe.font).toLowerCase() === String(postScriptName).toLowerCase();
        } catch (_) { return false; }
    }
    function applyTextStyle(base) {
        var textProp = base.property("ADBE Text Properties").property("ADBE Text Document");
        var td = textProp.value;
        td.text = String(td.text).toUpperCase();
        td.tracking = -12;
        td.applyFill = true;
        td.applyStroke = false;
        td.fillColor = color("#202A34");
        try { td.fauxItalic = true; } catch (_) {}
        var candidates = ["ChineseRocksRg-Regular", "ChineseRocks", "Chinese Rocks"];
        var detected = false;
        for (var i=0; i<candidates.length; i++) {
            if (fontAvailable(candidates[i])) { td.font = candidates[i]; detected = true; break; }
        }
        if (!detected) {
            var fallbacks = ["Impact", "Arial-Black", "Arial-BoldMT"];
            for (var j=0; j<fallbacks.length; j++) {
                if (fontAvailable(fallbacks[j])) { td.font = fallbacks[j]; break; }
            }
        }
        textProp.setValue(td);
        return detected;
    }

    if (parseFloat(app.version) < 17.0) return fail("After Effects 2020 ou plus récent est requis.");
    var comp = app.project && app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return fail("Ouvrez une composition et sélectionnez un calque texte.");
    if (comp.selectedLayers.length !== 1) return fail("Sélectionnez exactement un calque texte.");
    var base = comp.selectedLayers[0];
    if (!base.property("ADBE Text Properties")) return fail("Le calque sélectionné n’est pas un calque texte.");
    var variantName = chooseVariant();
    if (!variantName) return "ERR|Application annulée.";
    var v = variants[variantName];
    var result = "";

    app.beginUndoGroup("Apply Text Metal Blue - " + variantName);
    try {
        var unique = String((new Date()).getTime());
        base.name = "MB BASE • " + unique;
        var fontDetected = applyTextStyle(base);
        clearEffects(base);

        var ctrl = comp.layers.addNull();
        ctrl.name = "TEXT FX CONTROLS • " + unique;
        ctrl.label = 9;
        ctrl.moveBefore(base);
        addSlider(ctrl,"Metal Brightness",v.brightness);
        addSlider(ctrl,"Metal Contrast",v.contrast);
        addSlider(ctrl,"Top Darkness",v.top);
        addSlider(ctrl,"Blue Amount",v.blue);
        addSlider(ctrl,"Cyan Amount",v.cyan);
        addSlider(ctrl,"Stroke Width",v.stroke);
        addSlider(ctrl,"Stroke Brightness",v.strokeBright);
        addSlider(ctrl,"Bevel Depth",v.bevel);
        addSlider(ctrl,"Highlight",v.highlight);
        addSlider(ctrl,"Glow Amount",v.glow);
        addSlider(ctrl,"Glow Radius",v.glowRadius);
        addSlider(ctrl,"Shadow Amount",v.shadow);
        addSlider(ctrl,"Metal Center",52);
        ctrl.comment = "FX Pro | Metal Blue Text | " + variantName + " | Native AE 2020";

        var ctrlName = ctrl.name;
        var cRef = "thisComp.layer(\"" + esc(ctrlName) + "\")";

        var shadow = base.duplicate(); shadow.name = "MB 01 • Shadow"; clearEffects(shadow); shadow.moveAfter(base);
        setExpression(shadow.property("ADBE Text Properties").property("ADBE Text Document"), "thisComp.layer(\""+esc(base.name)+"\").text.sourceText");
        addFill(shadow,"MB Shadow Fill",color("#081018"));
        setExpression(shadow.property("ADBE Transform Group").property("ADBE Position"), "var d="+cRef+".effect(\"Shadow Amount\")(1)/18;thisComp.layer(\""+esc(base.name)+"\").transform.position+[d,d]");
        setExpression(shadow.property("ADBE Transform Group").property("ADBE Opacity"), cRef+".effect(\"Shadow Amount\")(1)");
        var blur = addEffect(shadow,["ADBE Gaussian Blur 2","ADBE Fast Blur"],"MB Soft Shadow"); if (blur) setIndex(blur,1,2);

        var outer = base.duplicate(); outer.name = "MB 02 • Outer Bright Stroke"; clearEffects(outer); outer.moveAfter(base);
        setExpression(outer.property("ADBE Text Properties").property("ADBE Text Document"), "thisComp.layer(\""+esc(base.name)+"\").text.sourceText");
        var mm = addEffect(outer,["ADBE Minimax"],"MB Outer Width");
        if (mm) { setExpression(mm.property(2), "Math.max(1,"+cRef+".effect(\"Stroke Width\")(1)*thisComp.height/1080)"); setIndex(mm,3,1); }
        var outFill = addFill(outer,"MB Outer Color",color("#A9C4D2"));
        setExpression(outer.property("ADBE Transform Group").property("ADBE Opacity"), cRef+".effect(\"Stroke Brightness\")(1)");
        var glow = addEffect(outer,["ADBE Glo2"],"MB Subtle Glow");
        if (glow) { setIndex(glow,2,72); setExpression(glow.property(3), cRef+".effect(\"Glow Radius\")(1)*thisComp.height/1080"); setExpression(glow.property(4), cRef+".effect(\"Glow Amount\")(1)"); }

        var inner = base.duplicate(); inner.name = "MB 03 • Inner Dark Edge"; clearEffects(inner); inner.moveAfter(base);
        setExpression(inner.property("ADBE Text Properties").property("ADBE Text Document"), "thisComp.layer(\""+esc(base.name)+"\").text.sourceText");
        var mi = addEffect(inner,["ADBE Minimax"],"MB Inner Width"); if (mi) { setExpression(mi.property(2), "Math.max(1,"+cRef+".effect(\"Stroke Width\")(1)*.42*thisComp.height/1080)"); setIndex(mi,3,1); }
        addFill(inner,"MB Inner Color",color("#15212A"));

        duplicatePass(base,"MB 04 • Top Steel",ctrlName,color("#202A34"),-0.15,0.38,0.10,cRef+".effect(\"Top Darkness\")(1)");
        duplicatePass(base,"MB 05 • Upper Mid",ctrlName,color("#516675"),0.12,0.58,0.13,"65+"+cRef+".effect(\"Metal Contrast\")(1)*.25");
        duplicatePass(base,"MB 06 • Steel Center",ctrlName,color("#A6BBC8"),0.34,0.67,0.11,cRef+".effect(\"Highlight\")(1)*1.35");
        duplicatePass(base,"MB 07 • Cyan Lower",ctrlName,color("#4299C8"),0.48,0.90,0.15,cRef+".effect(\"Cyan Amount\")(1)");
        duplicatePass(base,"MB 08 • Deep Blue",ctrlName,color("#11628D"),0.70,1.16,0.12,cRef+".effect(\"Blue Amount\")(1)");

        var hi = base.duplicate(); hi.name = "MB 09 • Cold Top Highlight"; clearEffects(hi); hi.moveAfter(base);
        setExpression(hi.property("ADBE Text Properties").property("ADBE Text Document"), "thisComp.layer(\""+esc(base.name)+"\").text.sourceText");
        addFill(hi,"MB Highlight Color",color("#D3E6EF"));
        addRectMask(hi,"MB Thin Highlight",-0.08,0.16,0.035,ctrlName);
        setExpression(hi.property("ADBE Transform Group").property("ADBE Opacity"), cRef+".effect(\"Highlight\")(1)");
        setExpression(hi.property("ADBE Transform Group").property("ADBE Position"), "thisComp.layer(\""+esc(base.name)+"\").transform.position+[0,-Math.max(1,"+cRef+".effect(\"Bevel Depth\")(1)*thisComp.height/1080)]");

        var bevel = addEffect(base,["ADBE Bevel Alpha"],"MB Bevel Alpha");
        if (bevel) { setExpression(bevel.property(1), cRef+".effect(\"Bevel Depth\")(1)*thisComp.height/1080"); setIndex(bevel,2,120); setIndex(bevel,3,0.45); }
        var bc = addEffect(base,["ADBE Brightness & Contrast 2","ADBE Brightness & Contrast"],"MB Metal Grade");
        if (bc) { setExpression(bc.property(1), cRef+".effect(\"Metal Brightness\")(1)"); setExpression(bc.property(2), cRef+".effect(\"Metal Contrast\")(1)"); }

        base.comment = "FX Pro preset: Metal Blue Text / " + variantName + "; Chinese Rocks detected: " + (fontDetected ? "YES" : "NO");
        base.selected = true;
        result = "OK|TEXT METAL BLUE " + variantName + " appliqué. Chinese Rocks: " + (fontDetected ? "YES" : "NO — police fallback utilisée");
        if (!silent && !fontDetected) alert("Chinese Rocks n’est pas installée. Une police fallback a été utilisée ; tout le style reste actif.", SCRIPT_NAME);
    } catch (e) {
        result = "ERR|Création impossible : " + e.toString() + " (ligne " + e.line + ")";
        if (!silent) alert(result, SCRIPT_NAME);
    } finally {
        app.endUndoGroup();
    }
    return result;
})();

