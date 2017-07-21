app
        .factory('Page', function ($http, $filter, config) {
            return {
                getFavorites: function () {
                    var favorites = localStorage.getItem('favorites');
                    if (favorites !== null) {

                        favorites = JSON.parse(favorites);

                        angular.forEach(favorites, function(obj, key) {
                            obj.toShow = true;
                        });

                        return favorites;
                    } else {
                        return [];
                    }

                },
                checkFavorites: function () {
                    var favorites = localStorage.getItem('favorites');

                    if (favorites !== null && JSON.parse(favorites).length) {
                        return true;
                    } else {
                        return false;
                    }

                },
                addFavorite: function (page) {
                    var favorites = this.getFavorites();
                    var found = $filter('filter')(favorites, {id: page.id}, true);
                    if (!found.length) {
                        favorites.push(page);
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                    }
                },
                isFavorite: function (page) {
                    var favorites = this.getFavorites();
                    var found = $filter('filter')(favorites, {id: page.id}, true);
                    if (found.length) {
                        return true;
                    }
                    return false;
                },
                removeFavorite: function (pageId) {
                    var favorites = this.getFavorites();
                    var found = $filter('filter')(favorites, {id: pageId}, true);
                    if (found.length) {
                        var keepGoing = true;
                        angular.forEach(favorites, function (value, key) {
                            if (keepGoing) {
                                if (value.id == pageId) {
                                    favorites.splice(key, 1);
                                    keepGoing = false;
                                }
                            }
                        });
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                    }

                },
            };
        })
        .factory('Note', function ($filter) {
            return {
                getNotes: function () {
                    var notes = localStorage.getItem('notes');
                    if (notes !== null) {
                        return JSON.parse(notes);
                    } else {
                        return [];
                    }
                },
                addNote: function (page) {
                    var notes = this.getNotes();
                    var newId = notes[page.id] && notes[page.id].length ? notes[page.id][notes[page.id].length - 1].id + 1 : 0;
                    page.newNote.id = newId;
                    if (!notes[page.id]) {
                        notes[page.id] = [];
                    }
                    notes[page.id].push(page.newNote);
                    localStorage.setItem('notes', JSON.stringify(notes));
                    return notes[page.id];
                },
                removeNote: function (pageId, noteId) {
                    var notes = this.getNotes();
                    var found = $filter('filter')(notes[pageId], {id: noteId}, true);
                    if (found.length) {
                        var keepGoing = true;
                        angular.forEach(notes[pageId], function (value, key) {
                            if (keepGoing) {
                                if (value.id == noteId) {
                                    notes[pageId].splice(key, 1);
                                    keepGoing = false;
                                }
                            }
                        });
                        localStorage.setItem('notes', JSON.stringify(notes));
                    }
                },
                removeAllNotesByPage: function(pageId) {
                    var notes = this.getNotes();
                    if(notes[pageId]) {
                        angular.forEach(notes[pageId], function (value, key) {
                            notes[pageId].splice(key);
                        });
                    }
                    localStorage.setItem('notes', JSON.stringify(notes));
                }
            };
        });
