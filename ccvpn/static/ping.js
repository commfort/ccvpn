var npings = 6;

function ping(host, callback, avg, count) {
    var start;
    var done = false;
    var img = new Image();
    if (typeof(avg) === 'undefined') {
        avg = 0;
    }
    if (typeof(count) === 'undefined') {
        // -1 to ignore the first ping, so the DNS lookup does not change
        // the average time.
        count = -1;
    }
    count = count + 1;
    function ok() {
        done = true;
        var time = new Date() - start;
        if (count > 0) {
            avg = ((avg * (count-1)) + time) / (count)
        } else {
            avg = 0;
        }
        if (count >= npings) {
            callback(Math.round(avg) + 'ms');
        } else {
            ping(host, callback, avg, count);
        }
    }
    function fail() {
        if (!done) {
            callback('timeout');
        }
    }
    img.onload = ok;
    img.onerror = ok;
    start = new Date();
    img.src = host;
    var timer = setTimeout(fail, 1500);
    callback('...');
}

window.addEventListener('load', function() {
    var lines = document.getElementsByClassName('host_line');
    for (var i=0; i<lines.length; i++) {
        var line = lines[i];
        
        var ping_link = document.createElement('a');
        ping_link.href = '#';
        ping_link.innerHTML = '[ping]';
        ping_link.onclick = (function(line) {
            return function() {
                result = ping('http://' + line.children[0].innerHTML + '/ping',
                    function(r) {
                        line.children[1].innerHTML = '[ping: '+r+']';
                    });
                return false;
            }
        })(line);
        line.appendChild(ping_link);
    }
}, false);

