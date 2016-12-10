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
             * The var description
             * @var /bar/foo Some description
             * another line of description
             * @something
             * @throws Ns
             * @model(table='', property=true, [1,2,3])
             * @tag {kind} something
             * @json({
             *   "key": "value",
             *   "object": { "inner": true },
             *   "list": [1, 2, 3]
             * }) hehe
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
