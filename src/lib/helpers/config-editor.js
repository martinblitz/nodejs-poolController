/*  nodejs-poolController.  An application to control pool equipment.
 *  Copyright (C) 2016, 2017.  Russell Goldin, tagyoureit.  russ.goldin@gmail.com
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

//TODO: make an 'update' function so poolHeatModeStr/spaHeatModeStr update when we set the corresponding modes.

var //fsio = require('promised-io/fs'),
    config,
    dir = '/',
    file,
    path = require('path').posix,
    location

var Promise = require('bluebird'),
    fs = require('fs')
Promise.promisifyAll(fs)

module.exports = function(container) {
    /*istanbul ignore next */
    if (container.logModuleLoading)
        container.logger.info('Loading: config-editor.js')

    file = exports.file = container.settings.configurationFile //exported for API Test #8
    location = path.join(process.cwd(), dir, file)


    var init = function() {
        if (config) {
            return Promise.resolve(config)
        } else {
            return fs.readFileAsync(location, 'utf-8').then(function(data) {
                config = JSON.parse(data)
                return config
            })
        }
    }

    var updatePumpProgramRPM = function(_pump, program, rpm) {
        return init()
            .then(function(data) {
                data.equipment.pump[_pump].programRPM[program] = rpm
                return fs.writeFileAsync(location, JSON.stringify(data, null, 4), 'utf-8')
            })
            .then(function() {
                container.logger.verbose('Updated pump settings %s', location)
            })
            .catch(function(err) {
                container.logger.warn('Error updating config pump settings %s: ', location, err)
            })
    }

    var updateVersionNotification = function(dismissUntilNextRemoteVersionBump) {
        return init()
            .then(function(data) {
                data.poolController.notifications.version.remote.dismissUntilNextRemoteVersionBump = dismissUntilNextRemoteVersionBump
                results = container.updateAvailable.getResults()
                data.poolController.notifications.version.remote.version = results.version
                data.poolController.notifications.version.remote.tag_name = results.tag_name
                return Promise.resolve(data)
            })
            .then(function(data) {
                return fs.writeFileAsync(location, JSON.stringify(data, null, 4), 'utf-8')
            })
            .then(function() {
                return container.logger.verbose('Updated version notification settings %s', location)
            })
            .catch(function(err) {
                container.logger.warn('Error updating version notification settings %s: ', location, err)
            })
    }

    var getPumpProgramRPM = function(_pump) {
        return init()
            .then(function(config) {
                return config.equipment.pump[_pump].programRPM
            })
            .catch(function(err) {
                container.logger.error('Something went wrong getting pump program from config file.', err)
            })
    }

    var getVersionNotification = function(_pump) {
        return init(config)
            .then(function() {
                return config.poolController.notifications.version.remote
            })
            .catch(function(err) {
                container.logger.error('Something went wrong getting version notification from config file.', err)
            })
    }



    /*istanbul ignore next */
    if (container.logModuleLoading)
        container.logger.info('Loaded: config-editor.js')


    return {
        init: init,
        updatePumpProgramRPM: updatePumpProgramRPM,
        updateVersionNotification: updateVersionNotification,
        getPumpProgramRPM: getPumpProgramRPM,
        getVersionNotification: getVersionNotification
    }
}
