begin;

alter table public.expenses
  drop constraint if exists expenses_split_mode_check;

alter table public.expenses
  add constraint expenses_split_mode_check
  check (split_mode in ('equal', 'weighted', 'custom'));

comment on column public.expenses.split_mode is
  'equal = 等额, weighted = 加权, custom = 每个参与者手动指定 share_cents';

commit;
