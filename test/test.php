<?php
declare(encoding='UTF-8');

/**
 * Some namespace descripion
 */
namespace foobar {

    const BAR = 123;

    if ($something) {
        class foo {
            /**
             * @var bar
             */
            protected $bar;
        }
    } else {
        class foo {
            /**
             * @var baz
             */
            protected $baz;
        }
    }
}

namespace {
    $a = true;
    $b = $a;

    function something() use($b) {
        $c = $b;
        return $c * 10;
    }

}
