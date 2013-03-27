#!/bin/sh
basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node_modules/.bin/node" ]; then
  "$basedir/node_modules/.bin/node" "$basedir/node_modules/jake/bin/cli.js" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/jake/bin/cli.js" "$@"
  ret=$?
fi
exit $ret
