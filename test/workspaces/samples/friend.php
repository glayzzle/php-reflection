<?php

    namespace {
        function hey() {
            return true;
        }
        interface foo {
          public function doFoo($arg);
        }
    }

    namespace foobar {
        const BAZ = 321;
        abstract class oof extends foo {
            use fooAble;
            abstract function doTodo();
        }
        trait fooAble {
            public function weAreHere() {
                return false;
            }
        }
    }
