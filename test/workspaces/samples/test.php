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
        /**
         * @class(something)
         */
        class foo {
            /**
             * A const value
             */
            const baz = 123;
            /**
             * The var description
             *
             * @var /bar/foo Some description
             * another line of description
             *
             * @something strange
             *
             * @throws Ns
             * 
             * @model(table='', property=true, [1,2,3])
             * some explanation
             * 
             * @tag {kind} something
             * @json({
             *   "key": "value",
             *   "object": { "inner": true },
             *   "list": [1, 2, 3],
             *   'fall"back': @method("name", false)
             * })
             * Some additionnal informations / comments
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
