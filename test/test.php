<?php

declare(encoding='UTF-8');

/**
 * Some namespace descripion
 */
namespace foobar {

    const BAR = 123;

    include __DIR__ . '/some-file.php';
    require_once 'another-file.php';

    if ($something) {
        class foo {
            const baz = 123;
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
    $something = function() use($b) {
        $c = $b;
        return $c * 10;
    };

}
