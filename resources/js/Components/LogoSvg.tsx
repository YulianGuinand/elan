export const LogoSvg = () => {
    return (
        <div className="size-full">
            <style>{`
                @keyframes petalAppear {
                    0%, 12.5% {
                        opacity: 1;
                    }
                    25%, 100% {
                        opacity: 0.1;
                    }
                }

                .petal {
                    opacity: 0.1;
                    animation: petalAppear 2s ease infinite;
                }

                .petal-1 { animation-delay: 0s; }
                .petal-2 { animation-delay: 0.25s; }
                .petal-3 { animation-delay: 0.5s; }
                .petal-4 { animation-delay: 0.75s; }
                .petal-5 { animation-delay: 1s; }
                .petal-6 { animation-delay: 1.25s; }
                .petal-7 { animation-delay: 1.5s; }
                .petal-8 { animation-delay: 1.75s; }
            `}</style>
            <svg
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 489 305"
                width="100%"
                height="100%"
            >
                <defs>
                    <image
                        width="150"
                        height="81"
                        id="img1"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABRAgMAAABNgrd9AAAAAXNSR0IB2cksfwAAAAlQTFRFAAAAAKap8YYooA1bqQAAAAN0Uk5TAP8AaVI5rAAAAd9JREFUeJyNlrFxwzAMRUHdpVGfJTJFRkgR7ZMpUuZc+qwUHsH7uFejIiFIUAApfkgscvbl3cf/n6SlQGBNzwe9fcmXJSCKzmATncEiReudxouLvb6fwV4++O/fr4+FTxJsuDrYRGewZIzXTHSDWDZ2iE10BttGVv22mKQ8wibz2fTbYOrfw+xIBzP+qeq3wqqRGJuoXlqcxRoxgNX+BZPiDFb756X9KrYXY0waUWwvZorbsJ3/jEkjG9aWwUuLK1hPjDFppGA9MVOcYF0xU5xgfTEtLmNATIvLGBDT4hKGxLS4hCExbYQxKFZjUEwbiRgWS1jKEDFHbGtkCZ7YFnUJnhhjKcMSOsdRF0flDEvoHG6z5oK5EUrUg0I4Kmc4qLdk8DcrY9Gcv/U5ajTnH6ScIZrzj2XOEKf6h1zMjRe5Mngr2NxwFQxvBWN0K9cZy7G58VswLMfmhp/yUwPl0tRLwbDcnP5dvkE5NqeYd/UthjpO5sxzAcnNNYbkeKp9GIEUPNViqJS5xpBcnFo/nfsp4lTnIa7r+WheCfpj17vzgmHW3L6u9MeuzsuPp9Ydu4vQHbvrLa1d2nYX+vbarQf2moME7DWnF9mrrwzi0hlHmHLpYkFs49JMjEnePJP+AQoe4gJBS03yAAAAAElFTkSuQmCC"
                    />
                    <image
                        width="80"
                        height="54"
                        id="img2"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA2AgMAAAAt0vZ5AAAAAXNSR0IB2cksfwAAAAlQTFRFAKapAAAAAH6X4qXD6QAAAAN0Uk5TAAD/13QrUwAAAPNJREFUeJx1080ZgjAMBuD04Aju4wZyEA+O4GjgoSOwDyNwwKRp/krLQfSlzZeahwTluk18T89Mn/zj/pBnRxZML7utgrybHyny7hkE+Zuru8JpWOueP491YcC6kPBQrAsDysKAck46kaLs9qi7CfeKutuj7vZohzW0ki7ISjq0kq55K2noStq/5Er2UcfhcgxdjqLPAdi3gqFkH/FIhCFHMORQoyOM4dQTYswZ4L4hxvABHhkxhlN8mtvwPsKa5jYcaO5dbMOBpnlFHFzb0QAhvS8dYUsXpGl+ppYapHe94Fc7wtlCRFnEuECZVWxpCWv4+gOLy3xsI4C9oAAAAABJRU5ErkJggg=="
                    />
                    <image
                        width="122"
                        height="88"
                        id="img3"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAABYAgMAAABHUwtKAAAAAXNSR0IB2cksfwAAAAlQTFRFAAAAAKapAH6Xk7CH5gAAAAN0Uk5TAP8AaVI5rAAAAatJREFUeJy9ljFuwzAMRckC3rN471F8BA8J0LFHyUmKjAGUwUfI0tN4ye7BlSzJJCVKGozUQ6DgJfqPTkwKIV7jtC/h/IgrjIt+mJ+0XqaE9wNA/ABfB37ZXv23HAZYfQTiefkdKPl1ovXSgcFuhMrV4nOT98M7+XKYX2r4H/h762vf32O/r7H/rwN8fTQ51G7gMiHUCmzx+YlQK7DFjX3+KgXYZxChUkCL2+cZoVKAbQKWlwVb3Gz9o1iAayGuv5QEIy8JunZU466HOV4StHqA12tJ0MV/4u27JEhcF3B6N7x/lQSs3sfP1l917vR8/1UFfQP2/VkT9M3ac03Qd3jPNYEtPnBNgHNFIM4HKAiECRR4LhAGUOC5gAHOM4EQL+abEl/kyfzLBEP8zhPBGE/zVwpm8zcR2Gf1zqVAjCcuBNZ8/guBPZ5xHkBHBeI8wEDOWQDFc04VUjznJEDxnJOAAY3vAixe8CjAthc8CrDtBQ8CfHvBxSlJ416Ax0vuAwyU+BYg4hPuAkR8wl2FIj7hVkBun3ArILdPOT9larwbDdQ4O7nq/PSS7/8As6WgacKHYHgAAAAASUVORK5CYII="
                    />
                    <image
                        width="81"
                        height="54"
                        id="img4"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAA2AgMAAADCEJ1HAAAAAXNSR0IB2cksfwAAAAlQTFRFAAAAAH6XAKapskFuUAAAAAN0Uk5TAP8AaVI5rAAAAQBJREFUeJyNkr0NwjAQRn1FGnqWYAp6GgoiUTJKRkmJSApGYIoskREowvl89vnuYglL+XtR3vfZDgQc3eUdaBxGuiyAJ7iFL+OX0B4PxqdB0bB+RLHAMITjOd5OoqjoNocyYHwwZYel7Mi0u6b7XE9TMcPzXqiYFS0KRUueplmhaVZomltomsWGsthQFtdzE7GhLK7XTMSy6rXY0iQuu6nEf1KKA/p1qkFxjlIc0noSLUpxSOu6HNekqlgq4WmMA1OsRWMJsMWYmgpUYodiCbAVEnVhsQS4sAbFEuDCiLqwWG2nA1G3PFgN6Krlmept2maQh36XygeTovmFoyH+NesP/MF39wNPcSEAAAAASUVORK5CYII="
                    />
                    <image
                        width="150"
                        height="81"
                        id="img5"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABRAgMAAABNgrd9AAAAAXNSR0IB2cksfwAAAAlQTFRF8YYoAAAAAKapPL/FnAAAAAN0Uk5TAAD/13QrUwAAAeNJREFUeJyNljFSxDAMRZWCI+xpaPYIFJhDcDCYYbfYnmZPQ5OeJkWwZMtW7C+xmVSZN//n/9iOFtLrdKbT843gtS0WS7RhzmBJbsxNGK33EFte+XY4gNHlMWy/BtjTC9/l4RQDYrPtAcvNEbbtGH+Ec3t8ewgbbTtW28W2HjaU3LBeG7L1sUMKHzvYNsy2O6cIMCvXsGNtY4oQ6ykaNtQ2yMVYS6EYlzFjLYXBhtoOcorlMhCmcgYba7NyiuUyIFblDDbVZuQUS+RgpWODgT7kunTMqa3JVczrQ+UewbJcxdw+qlzHnKBFrmJ+H0WuYFFQkbsIxu8VYfShmB+Ur1/B4qD5+hEsUYztn4yxYRSU1u+F/k+wX6UQVoqw9S5YojBoXpmMMRIlyOucMUaCBLzMGWMkwHjTMJYoSiB7JmPsGSSQHZgx9vMTtA3Ifv6r6XYWP/fV2uHAQuGuKhgLua+mx2rB3FfTU1Uw17Od0YK5nuaIDvZe/38I5tRh/kaMeZ6Hn1EKzz+DOZ72v5sxx3P47aboaO7YG+52HAneodgwr2zLFxSbxhWoNo56OQLoY5rMMjavj3nOg19hni7RpwczLVhvYLREqxcMqmAvIKpiRg4O0RXrITClmLpCx44VV5SxYn9VxfEyalPy5AAAAABJRU5ErkJggg=="
                    />
                    <image
                        width="115"
                        height="166"
                        id="img6"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAACmAgMAAACU3ljpAAAAAXNSR0IB2cksfwAAAAxQTFRFAAAA8YYo8YYoAKapD9sTlQAAAAR0Uk5TAP8AAA0LUncAAAKoSURBVHicxdg7chsxDAZgajKuU+U88RFceDUufRQdJWXGcqEjyJfwJdSkSqMkGzwIEgQBirajiQq7+EYAflDe1XqTBq/7TWw3d2usS0qhbu5TrF9u8efZ14V/+ZrRVWoZ6c1dilVhrxrTaTNAqy0aNdiqxUY71FqXUF77qkuHoLtdiFX5yDr99uhPxPr9wZ8IXuszq9eU9GkbNJ3R190F9SdO58Pm6efjBfUDkf55uKBBXtS0jfR0ZPUjkYaBRf1IpGFgUT/SPoGGgUX9SKRh4KL+h440CLw+i3qRsgaBpzQIfD5MaBB4Wp3Aov46TscZ9QPPqR94nz6u/jqGCkeUFQKPtVvHrMI6OoVDqNota1ZhHWPtlgWHMKWwrDcqrLlqt8ppdY5hqLhmpWbR89of0lhxzf9I7T3/WLU/4I8oLvI/KC3yKkqLvIrSIq+itKqRri+30Wdjnz79Si+BwqpAf89q85mEZXz+cRWFZXw9FrV/gxd1TVqbv31c1TuVl1HUXJHGynGVNlfCt6i9AvMylLaPEUPluKL28Iea4yrVh2DUHBEEGivGFTWLhEBjxbhZ7aog0Fgxrq94RVEaLMNXiZvVxJVAWc23r151XAnEar8ES6CibiBW8+W7jMxqvuXCUGPlkVlNoDIyKY6sFIcyqgLhtZdHJjUj16FIYSit0FbrtnmUxLZ5ZFE1FLbNQ6GakfGynYdChaH0yHjZVtoOhW1lKNRt8wiLhWUoUHyGVSNjYRkKFJ+O61B0+5O2oPhkXYfCPKUtaGraYuHSlrW2pcKlLWttS3ew0pZ1ad5aC5Oq/6McmsKktS3d/Gph0tKW3lrzsC7NW1Vh1NKWb+aqMKq05e8QujCqtOW7tS4MKoW5blMYNBfmunoVpFw4Y/tW0KX2NDOB/gUuuYgp3vAWoAAAAABJRU5ErkJggg=="
                    />
                    <image
                        width="134"
                        height="210"
                        id="img7"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAADSAgMAAADyCFDjAAAAAXNSR0IB2cksfwAAAAlQTFRFAAAA8YYo8YYo6udvTwAAAAN0Uk5TAP8AaVI5rAAAA0dJREFUeJztmTFuGzEQRUkDbtS7d60cIU2OkMIrpPQpUusUKYMtBcmFj6BT5BLq1QiwwpkhueQshzOBFoKLuBGgfTL/G1Fazsg79uevs2f4E49fjxry9EVFhsu7ilzfFMS/qMjjd3fQkdOxjzx9czwvRwanIf7FOZ63gfC8DAlpNSSkdVyphbC8DBmchmBartRCWN4aQaE+gmm5UhOp89bI4DQkpmVKTaTOWyFRqIfEtEypjVR5K2RwGpLT1kptpMpbIllIRnLaWklAyrwlMjgNKdJWSgJS5i2QQsiEFEoFUghVeQukEDIhhdKEVEJtpEpbKonIpDQhlZAJmZQmpBIq82akFjIhk1JGmJAJyUoZYUKFUkaYkAnJSgmZCVmQrJSQmdAcmQlN1h0kKSVkJmRCklJEGkIWJClFpOE8IeMrPDSEkvWz3//ZSggqrX75vdu4phAhD7tzQD5+CAgo7V1EmkIFcn4VEFDKSNMZkfUWkKAkIME6I01nRFbjmaQFJFhnpOmMCNZFLAtaJ0RwpsIERHamwujI+ie+04IQFUZHYDPIZaHCECI4U2F++51cFioMIlJZqDAjbG8ZAWtExLIg8uy34m6Bv2CNiOhsQuBzAh9Y0dmEgLUXvhX+Gek4Y2EWQEJhfGe3GJFQGN8ty1JIKIzvVs6EhML4flmWQk5H36/cUsjl3fcrtxRyfbMgSv0XQtzBK/W/I3KyIMq7eEfkcj9E2S7/ERn5TG/j59m7JmSZD+zdvl8M33ULILbv3WXuAZabjeGudjsCt0/Dffp25GA7edx8fkFkoeOW4VxnOB0azpiGk6rhSGw4e1tO8FofoHYTTulJsG1Rmx8FoRaq24hBWkJ6HV/o1aDjE/PGvlFuyjFtRHqdMDSooc3t9NPYCX/IeUEoIfKEgAYaG3HLQNoxDhHkmQchkFccrtAoQgwDOyFPTsRZ0MMOEWlGA+usRkIgrzAAW28JgbzCGA2uAgJh2iO9EIUQDDNbCdYJUSICYZpzzBAlIhCGr4RDKbyICIZpzHchSkQwTGOQDFESgkOw+VAboiQEV5rP4PFaRGgl/nsArpMRXIn/woHrBIQeaSX2mw29+uzjv9vQy3GtOMBE5XDhL36J95JVfwiQAAAAAElFTkSuQmCC"
                    />
                    <image
                        width="116"
                        height="166"
                        id="img8"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAACmAgMAAAB2AkOQAAAAAXNSR0IB2cksfwAAAAxQTFRF8YYoAAAA8YYoAKap+6YhaQAAAAR0Uk5T/wAAAG2WYGsAAAKFSURBVHicrdfLTSQxEAZge6UJofOZEObQBo4byoaDtHsgBKIgCe5ckGBdtqv8u+yyh55BIy4fXc8ed+NdcPaPd+50sfX86uzLk7rtPFMrelHn95mOk1cdJfeXF2czal9box23qlmpYq0t+/2fqgQr7xV5oMAjlaH6ofJKvA9/e2U+jbX0tRmaKzM1VRZMpdRR318t9bupsa65ni6mxqLnup19+HwZanALDc7S1O5M6WNoaijq92DBK00NHdTU7kzjxwdn3VhTpT8wNG13pnRbRh2tMG13pnTPHtLc7loHKyztHtLS7loHS5prafeopnMn6mBJZRhHlIdxhXZriJQPrKHyMA5qPoVJuzXwqA5qPsDX2q2BB3lMy9G/Vr0GWYKl5Wl4hapBz1VWdEzLYzTpZ/d0v5eqUcryb1c1Srk17qDtsO6p7bDuqe2w9Kx+orjBX88Paligj89uot9uoW9/2mH9RD9+L7QZFnwXlvr11I4DvoM3qh4HnBtr1eMINymfhKR6HHOtJzCpbrie7Vdp03Crehz1ecSKLSlVDfeKLdVnaFLVcK9NS6FR3bA82VmbllrVDcv7hii2pNRouCq2pFS1JG9flub3uqyqpYFiWfn1mdVoiVUVze+xVbEsfkMuGovGspSOi0aFskjpnb8oFY1lhRydVZWVi0bFxBR2r0pFQ2LqNlSlsiBxLkuUyoLQpPF/OlFKDKGp270qJYbQtITQKvREZW1VU+IaOiUGpcQ1dFoCqAoNdw53DKHx3uDENTTeG5y4DgS3z4nh4tBqSlzrwu1LaKkL9yuh5WLcr4SumUOrObSUjfuV0BIbN5h+HtJvLiwozaGZN6W5LmavlC8uhf8Hp2nwDRkhXr8AAAAASUVORK5CYII="
                    />
                </defs>
                <style></style>
                <use href="#img1" x="0" y="141" className="petal petal-1" />
                <use href="#img2" x="106" y="217" className="petal petal-2" />
                <use href="#img3" x="183" y="217" className="petal petal-3" />
                <use href="#img4" x="302" y="217" className="petal petal-4" />
                <use href="#img5" x="339" y="141" className="petal petal-5" />
                <use href="#img6" x="284" y="44" className="petal petal-6" />
                <use href="#img7" x="177" y="0" className="petal petal-7" />
                <use href="#img8" x="89" y="44" className="petal petal-8" />
            </svg>
        </div>
    );
};
