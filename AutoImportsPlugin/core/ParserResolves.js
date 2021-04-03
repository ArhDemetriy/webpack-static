"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.ParserResolves = void 0;
var PartitionImports_1 = require("./PartitionImports");
var path = require("path");
var fs_1 = require("fs");
var ParserResolves = /** @class */ (function () {
    function ParserResolves(settings) {
        var e_1, _a;
        this.importPathsWisExtends = new Map();
        this.parsedImportFiles = new Map();
        this.init({ sources: settings.sources, importsFilePath: settings.startImportFilePath });
        this.pathImportFile = path.dirname(settings.startImportFilePath);
        this.parsedImportFilesGenerators = settings.parsedImportFilesGenerators;
        this.sources = settings.sources;
        try {
            for (var _b = __values(this.parsedImportFilesGenerators.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var importFile = _c.value;
                this.importPathsWisExtends.set(importFile, new Set());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    ParserResolves.prototype.init = function (q) {
        this.partitioner = new PartitionImports_1.PartitionImports(q);
    };
    ParserResolves.prototype.run = function () {
        var _this = this;
        return this.partitioner.getPartitionedNamesAsync()
            .then(function (importNamesCollection) { return _this.parseImportNames(importNamesCollection); })
            .then(function (importFilesCollection) { return _this.generateImportFiles(importFilesCollection); })
            .then(function (parsedImportFiles) { return _this.saveImportFiles(parsedImportFiles); });
    };
    ParserResolves.prototype.saveImportFiles = function (parsedImportFiles) {
        var e_2, _a;
        var q = [];
        try {
            for (var _b = __values(parsedImportFiles.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var importFileName = _c.value;
                var importFile = path.resolve(this.pathImportFile, importFileName);
                q.push(importFile);
                fs_1.promises.writeFile(importFile, parsedImportFiles.get(importFileName));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ParserResolves.prototype.generateImportFiles = function (importFilesCollection) {
        var e_3, _a;
        var _loop_1 = function (importFile) {
            var importGenerator = this_1.parsedImportFilesGenerators.get(importFile);
            var importsToFile = __spreadArray([], __read(importFilesCollection.get(importFile).values())).map(function (importPath) { return importGenerator(importPath); });
            this_1.parsedImportFiles.set(importFile, importsToFile.join(''));
        };
        var this_1 = this;
        try {
            for (var _b = __values(importFilesCollection.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var importFile = _c.value;
                _loop_1(importFile);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.parsedImportFiles;
    };
    ParserResolves.prototype.parseImportNames = function (importNamesCollection) {
        var e_4, _a, e_5, _b, e_6, _c;
        try {
            for (var _d = __values(this.importPathsWisExtends.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var importFile = _e.value;
                var importPathes = this.importPathsWisExtends.get(importFile);
                var importExtend = path.extname(importFile);
                try {
                    for (var _f = (e_5 = void 0, __values(importNamesCollection.keys())), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var source = _g.value;
                        try {
                            for (var _h = (e_6 = void 0, __values(importNamesCollection.get(source))), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var importName = _j.value;
                                importPathes.add(path.resolve(source, importName, importName.concat(importExtend)));
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return this.importPathsWisExtends;
    };
    ParserResolves.prototype.getPartitionedPaths = function () {
        return this.importPathsWisExtends;
    };
    ParserResolves.prototype.getPathsFrom = function (source) {
        return this.importPathsWisExtends.get(source);
    };
    return ParserResolves;
}());
exports.ParserResolves = ParserResolves;
