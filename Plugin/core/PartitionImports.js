"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.PartitionImports = void 0;
var path = require("path");
var fs_1 = require("fs");
var PartitionImports = /** @class */ (function () {
    function PartitionImports(settings) {
        var _this = this;
        this.partitionedImportNames = new Map();
        settings.sources.forEach(function (source) { return _this.partitionedImportNames.set(source, new Set); });
        this.sources = [].concat(settings.sources);
        this.importsFileName = path.basename(settings.importsFilePath);
        this.fierstStep(settings.importsFilePath);
    }
    PartitionImports.prototype.getPartitionedNames = function () {
        return this.partitionedImportNames;
    };
    PartitionImports.prototype.getPartitionedNamesAsync = function () {
        var _this = this;
        return this.notExistsImports.then(function (_) { return _this.partitionedImportNames; });
    };
    PartitionImports.prototype.checkExistsPromise = function (absolutePath, fsConstant) {
        if (fsConstant === void 0) { fsConstant = fs_1.constants.F_OK; }
        return fs_1.promises.access(path.resolve("" + absolutePath), fsConstant);
    };
    PartitionImports.prototype.getImportsFrom = function (absolutePath) {
        return require(path.resolve("" + absolutePath));
    };
    PartitionImports.prototype.fierstStep = function (importsFilePath) {
        this.notExistsImports = this.partitionImportsWhereAllSources(this.getImportsFrom(importsFilePath));
    };
    PartitionImports.prototype.partitionBlocksFromPath = function (source, searcheableBlocks, fsConstant) {
        if (fsConstant === void 0) { fsConstant = fs_1.constants.F_OK; }
        return __awaiter(this, void 0, void 0, function () {
            var searchers, searchingResults, partitionSearchingResults;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchers = [];
                        searcheableBlocks.forEach(function (block) {
                            var promise = _this.checkExistsPromise(path.resolve(source, block), fsConstant)
                                .then(function () { return block; }, function () { return Promise.reject(block); });
                            searchers.push(promise);
                        });
                        return [4 /*yield*/, Promise.allSettled(searchers)];
                    case 1:
                        searchingResults = _a.sent();
                        partitionSearchingResults = searchingResults.reduce(function (aggregator, searchingResult) {
                            if (searchingResult.status == 'fulfilled')
                                aggregator.exists.push(searchingResult.value);
                            else
                                aggregator.notExists.push(searchingResult.reason);
                            return aggregator;
                        }, { exists: [], notExists: [] });
                        return [2 /*return*/, partitionSearchingResults];
                }
            });
        });
    };
    PartitionImports.prototype.getAdditionalImports = function (where, checkableBlocks) {
        return __awaiter(this, void 0, void 0, function () {
            var checkableFiles, existsFiles, result, existsFiles_1, existsFiles_1_1, fileName;
            var e_1, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (checkableBlocks.length <= 0)
                            return [2 /*return*/, Promise.resolve([])];
                        checkableFiles = new Set(checkableBlocks.map(function (block) { return path.join(block, _this.importsFileName); }));
                        return [4 /*yield*/, this.partitionBlocksFromPath(where, checkableFiles, fs_1.constants.R_OK)];
                    case 1:
                        existsFiles = (_b.sent()).exists;
                        result = [];
                        try {
                            for (existsFiles_1 = __values(existsFiles), existsFiles_1_1 = existsFiles_1.next(); !existsFiles_1_1.done; existsFiles_1_1 = existsFiles_1.next()) {
                                fileName = existsFiles_1_1.value;
                                result.push.apply(result, __spreadArray([], __read(this.getImportsFrom(path.resolve(where, fileName)))));
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (existsFiles_1_1 && !existsFiles_1_1.done && (_a = existsFiles_1["return"])) _a.call(existsFiles_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    PartitionImports.prototype.getPartitionWisAdditionalBlocksFrom = function (where, checkableBlocks) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = (_a = Object).assign;
                        _c = [{ additional: [] }];
                        return [4 /*yield*/, this.partitionBlocksFromPath(where, new Set(checkableBlocks))];
                    case 1:
                        result = _b.apply(_a, _c.concat([_e.sent()]));
                        if (!(result.exists.length >= 1)) return [3 /*break*/, 3];
                        _d = result;
                        return [4 /*yield*/, this.getAdditionalImports(where, result.exists)];
                    case 2:
                        _d.additional = _e.sent();
                        _e.label = 3;
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    PartitionImports.prototype.recursivelyPartitiondBlocksFrom = function (where, partitionleBlocks) {
        return __awaiter(this, void 0, void 0, function () {
            var result, additional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            exists: [],
                            notExists: []
                        };
                        additional = partitionleBlocks;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.getPartitionWisAdditionalBlocksFrom(where, additional)
                            .then(function (partitionedBlocks) {
                            result.exists = result.exists.concat(partitionedBlocks.exists);
                            result.notExists = result.notExists.concat(partitionedBlocks.notExists);
                            return partitionedBlocks.additional;
                        })];
                    case 2:
                        additional = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (additional.length && !additional.every(function (blockName) { return result.notExists.includes(blockName); })) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        result.notExists = __spreadArray([], __read((new Set(result.notExists.concat(additional)))));
                        result.exists = __spreadArray([], __read((new Set(result.exists))));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PartitionImports.prototype.partitionImportsWhereAllSources = function (partitionleImports) {
        return __awaiter(this, void 0, void 0, function () {
            var findedBlocks, notExists, testArray, _loop_1, this_1, _a, _b, source, state_1, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        findedBlocks = new Set();
                        notExists = partitionleImports;
                        testArray = [];
                        _d.label = 1;
                    case 1:
                        testArray = __spreadArray([], __read(new Set(testArray.concat(notExists))));
                        _loop_1 = function (source) {
                            var importsFromThisSource;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        importsFromThisSource = this_1.partitionedImportNames.get(source);
                                        return [4 /*yield*/, this_1.recursivelyPartitiondBlocksFrom(source, notExists)
                                                .then(function (partitionedBlocks) {
                                                partitionedBlocks.exists.forEach(function (blockName) {
                                                    importsFromThisSource.add(blockName);
                                                    findedBlocks.add(blockName);
                                                });
                                                return partitionedBlocks.notExists;
                                            })];
                                    case 1:
                                        notExists = _e.sent();
                                        if (notExists.length <= 0)
                                            return [2 /*return*/, { value: [] }];
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 9]);
                        _a = (e_2 = void 0, __values(this.sources)), _b = _a.next();
                        _d.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        source = _b.value;
                        return [5 /*yield**/, _loop_1(source)];
                    case 4:
                        state_1 = _d.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        if (testArray.length < (new Set(notExists)).size)
                            return [3 /*break*/, 10];
                        _d.label = 10;
                    case 10:
                        if (notExists.length && notExists.some(function (blockName) { return !testArray.includes(blockName); })) return [3 /*break*/, 1];
                        _d.label = 11;
                    case 11:
                        if (notExists.length >= 2)
                            notExists = __spreadArray([], __read(new Set(notExists)));
                        return [2 /*return*/, notExists];
                }
            });
        });
    };
    return PartitionImports;
}());
exports.PartitionImports = PartitionImports;
